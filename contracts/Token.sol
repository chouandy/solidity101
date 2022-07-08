//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract Token is ERC20 {
    using Address for address;

    constructor() ERC20("Test Token", "TOKEN") {
        _mint(msg.sender, 100000000 * (10**uint256(decimals())));
    }
}
