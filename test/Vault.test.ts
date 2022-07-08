import { BigNumber } from 'ethers';
import { ETH } from './constant';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Token, Vault } from '../typechain';
import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('Vault', function () {
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let vault: Vault;
  let token: Token;
  let userETHBalance: BigNumber;
  let userTokenBalance: BigNumber;

  before(async function () {
    [owner, user] = await ethers.getSigners();

    vault = await (await (await ethers.getContractFactory('Vault')).deploy()).deployed();

    token = await (await (await ethers.getContractFactory('Token')).deploy()).deployed();
    await token.connect(owner).transfer(user.address, ethers.utils.parseEther('100'));
  });

  beforeEach(async function () {
    userETHBalance = await ethers.provider.getBalance(user.address);
    userTokenBalance = await token.balanceOf(user.address);
  });

  it('deposit native token', async function () {
    const amount = ethers.utils.parseEther('1');

    const tx = await vault.connect(user).depositNativeToken({ value: amount });
    const receipt = await tx.wait();
    expect(receipt).to.emit(vault, 'Deposit').withArgs(user.address, ETH, amount);

    const userETHBalanceAfter = await ethers.provider.getBalance(user.address);
    expect(userETHBalance.sub(userETHBalanceAfter).sub(receipt.gasUsed.mul(1e9))).to.eq(amount);

    const userVaultETHBalance = await vault.balanceOf(user.address, ETH);
    expect(userVaultETHBalance).to.eq(amount);
  });

  it('withdraw native token - success', async function () {
    const amount = ethers.utils.parseEther('0.5');

    const tx = await vault.connect(user).withdrawNativeToken(amount);
    const receipt = await tx.wait();
    expect(receipt).to.emit(vault, 'Withdrawal').withArgs(user.address, ETH, amount);

    const userETHBalanceAfter = await ethers.provider.getBalance(user.address);
    expect(userETHBalanceAfter.sub(userETHBalance).add(receipt.gasUsed.mul(1e9))).to.eq(amount);

    const userVaultETHBalance = await vault.balanceOf(user.address, ETH);
    expect(userVaultETHBalance).to.eq(ethers.utils.parseEther('0.5'));
  });

  it('withdraw native token - revert', async function () {
    const amount = ethers.utils.parseEther('1');
    await expect(vault.connect(user).withdrawNativeToken(amount)).to.be.revertedWith(
      'withdrawal amount exceeds balance'
    );
  });

  it('deposit erc20 token', async function () {
    const amount = ethers.utils.parseEther('1');

    await token.connect(user).approve(vault.address, amount);
    const tx = await vault.connect(user).deposit(token.address, amount);
    const receipt = await tx.wait();
    expect(receipt).to.emit(vault, 'Deposit').withArgs(user.address, token.address, amount);

    const userTokenBalanceAfter = await token.balanceOf(user.address);
    expect(userTokenBalance.sub(userTokenBalanceAfter)).to.eq(amount);

    const userVaultTokenBalance = await vault.balanceOf(user.address, token.address);
    expect(userVaultTokenBalance).to.eq(amount);
  });

  it('withdraw erc20 token - success', async function () {
    const amount = ethers.utils.parseEther('0.5');

    const tx = await vault.connect(user).withdraw(token.address, amount);
    const receipt = await tx.wait();
    expect(receipt).to.emit(vault, 'Withdrawal').withArgs(user.address, token.address, amount);

    const userTokenBalanceAfter = await token.balanceOf(user.address);
    expect(userTokenBalanceAfter.sub(userTokenBalance)).to.eq(amount);

    const userVaultTokenBalance = await vault.balanceOf(user.address, token.address);
    expect(userVaultTokenBalance).to.eq(ethers.utils.parseEther('0.5'));
  });

  it('withdraw erc20 token - revert', async function () {
    const amount = ethers.utils.parseEther('1');
    await expect(vault.connect(user).withdraw(token.address, amount)).to.be.revertedWith(
      'withdrawal amount exceeds balance'
    );
  });
});
