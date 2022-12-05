// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IOnchainPlace {
    function setPixel(uint256 position, uint256 color) external;
    function mint(uint256 offset) external payable;
    
    function totalSupply() external view returns (uint256 totalSupply);
    function totalChanges() external view returns (uint256 totalChanges);

    function mintFee() external pure returns (uint256 amount);
}