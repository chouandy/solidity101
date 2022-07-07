import { ANDY } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('Andy Token', function () {
  let owner: SignerWithAddress;
  let token: ANDY;

  before(async function () {
    [owner] = await ethers.getSigners();
    token = await (await ethers.getContractFactory('ANDY')).deploy();
    await token.deployed();
  });

  it('should assign the total supply of tokens to the owner after deployed', async function () {
    const balance = await token.balanceOf(owner.address);
    expect(await token.totalSupply()).to.equal(balance);
  });

  it('name should be Andy Token', async function () {
    expect(await token.name()).to.equal('Andy Token');
  });

  it('symbol should be ANDY', async function () {
    expect(await token.symbol()).to.equal('ANDY');
  });

  it('decimal should be 18', async function () {
    expect(await token.decimals()).to.equal(18);
  });
});
