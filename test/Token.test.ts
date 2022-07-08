import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Token } from '../typechain';
import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('Token', function () {
  let owner: SignerWithAddress;
  let token: Token;

  before(async function () {
    [owner] = await ethers.getSigners();

    token = await (await (await ethers.getContractFactory('Token')).deploy()).deployed();
  });

  it('should assign the total supply of token to the owner after deployed', async function () {
    const balance = await token.balanceOf(owner.address);
    expect(await token.totalSupply()).to.equal(balance);
  });

  it('name should be Test Token', async function () {
    expect(await token.name()).to.equal('Test Token');
  });

  it('symbol should be TOKEN', async function () {
    expect(await token.symbol()).to.equal('TOKEN');
  });

  it('decimal should be 18', async function () {
    expect(await token.decimals()).to.equal(18);
  });
});
