// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IOnchainPlace.sol";
import "./Parser.sol";

contract OnchainPlace is IOnchainPlace, ERC721, Ownable {
    event PixelSet (
        address indexed author,
        uint256 indexed position,
        uint256 indexed color,
        uint256 totalChanges
    );
    
    event Mint (
        address indexed owner,
        uint256 id,
        uint256 totalChanges
    );

    event Withdraw (
        address indexed receiver,
        address indexed token,
        uint256 amount
    );

    uint256 internal constant PLACE_WIDTH = 1000;
    uint256 internal constant PLACE_AREA = PLACE_WIDTH * PLACE_WIDTH;
    uint256 internal constant CHUNK_WIDTH = 16;
    uint256 internal constant CHUNK_AREA = CHUNK_WIDTH * CHUNK_WIDTH;

    uint256 internal constant MINT_FEE = 10 ** 18;

    uint256 internal constant MAX_COLOR = 15;

    struct Token {
        uint256[CHUNK_AREA] snapshot;
        uint256 offset;
        uint256 totalChanges;
    }

    // Place position => Pixel color
    mapping(uint256 => uint256) internal _pixels;

    // Token ID => Token data
    mapping(uint256 => Token) internal _tokens;

    // Total minted places
    uint256 internal _totalSupply;

    // Total pixel changes
    uint256 internal _totalChanges;

    constructor() ERC721("Onchain Place", "PLACE") {
        
    }

    receive() external payable {
        _mint(0);
    }

    /*
        @notice Set the color of a pixel in the place
    
        @param The position of the pixel in the place to change
        @param The color to set the pixel in the place
    */
    function setPixel(uint256 position, uint256 color) external override {
        require(position < PLACE_AREA);
        require(color <= MAX_COLOR);

        _pixels[position] = color;

        _totalChanges++;

        emit PixelSet(msg.sender, position, color, _totalChanges);
    }

    /*
        @notice Mint the current place

        @param The viewable offset
    */
    function mint(uint256 offset) external payable override {
        _mint(offset);
    }

    /*
        @dev Mint the current place

        @param The viewable offset
    */
    function _mint(uint256 offset) internal {
        require(msg.value >= MINT_FEE);
        require(_tokens[_totalSupply - 1].totalChanges != _totalChanges || _totalSupply == 0);
        require(offset - ((offset / 1000) * 1000) <= PLACE_WIDTH - CHUNK_WIDTH);
        require(offset / 1000 <= PLACE_WIDTH - CHUNK_WIDTH);
    
        _tokens[_totalSupply].totalChanges = _totalChanges;

        for(uint256 i = 0; i < CHUNK_AREA; i++) {
            uint256 y = i / CHUNK_WIDTH;
            uint256 x = i - (y * CHUNK_WIDTH);
            uint256 position = (offset + x) + (PLACE_WIDTH * y);

            _tokens[_totalSupply].snapshot[i] = _pixels[position];
        }

        _safeMint(msg.sender, _totalSupply);

        emit Mint(msg.sender, _totalSupply, _totalChanges);

        _totalSupply++;
    }

    /*
        @notice Returns the standard NFT metadata for a minted place

        @param Mint ID

        @return URI of the mint ID
    */
    function tokenURI(uint256 id) public view override returns (string memory) {
        require(id < _totalSupply);

        return string(abi.encodePacked(
            "data:application/json;base64,",
            Parser.encode(abi.encodePacked(
                '{"name": "Onchain Place #',
                Parser.toString(id),
                '", "description": "',
                "This place stays onchain", 
                '", "image": "data:image/svg+xml;base64,',
                Parser.encode(bytes(_tokenSvg(id))),
                '", "attributes": [{"trait_type": "Total changes", "value": "',
                Parser.toString(_tokens[id].totalChanges),
                '"},{"trait_type": "Offset", "value": "',
                Parser.toString(_tokens[id].offset),
                '"}]}'
            ))
        ));
    }

    /*
        @dev Returns the svg of the parameters mint ID
    
        @param Mint ID

        @return Svg of the parameters mint ID
    */
    function _tokenSvg(uint256 id) internal view returns (string memory) {      
        string memory chunk;

        string[16] memory colors = [
            "ffffff", "e4e4e4", "888888", "222222",
            "ffa7d1", "e50000", "e59500", "a06a42",
            "e5d900", "94e044", "02be01", "00d3dd",
            "0083c7", "0000ea", "cf6ee4", "820080"
        ];

        for(uint256 i = 0; i < CHUNK_AREA; i++) {
            uint256 y = i / CHUNK_WIDTH;
            uint256 x = i - (y * CHUNK_WIDTH);

            chunk = string(abi.encodePacked(
                chunk, 
                "<rect x='",
                Parser.toString(x),
                "' y='",
                Parser.toString(y),
                "' width='1' height='1' fill='#",
                colors[_tokens[id].snapshot[i]],
                "'/>"
            ));
        }

        return string(abi.encodePacked(
            "<svg id='onchainplace' xmlns='http://www.w3.org/2000/svg' shape-rendering='crispEdges' preserveAspectRatio='xMinYMin meet' viewBox='0 0 16 16'>", 
            chunk, 
            "</svg>"
        ));
    }

    /*
        @notice Returns the fee required to mint the current place
    
        @return Amount of native ETH required to mint the current place
    */
    function mintFee() external pure override returns (uint256) {
        return MINT_FEE;
    }

    /*
        @notice Returns the total number of minted places

        @return Total supply of minted places
    */
    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    /*
        @notice Returns the places total changes

        @return Total changes to the place
    */
    function totalChanges() external view override returns (uint256) {
        return _totalChanges;
    }

    /*
        @notice Withdraws this contracts ERC20 token balance, or native ETH

        @param The ERC20 token contract address. A zero address is equivalent to native ETH
    */
    function withdraw(address token) external onlyOwner {
        uint256 amount;
        if(token != address(0)) {
            IERC20 erc20 = IERC20(token);
            amount = erc20.balanceOf(address(this));
            erc20.transfer(owner(), amount);
        } else {
            amount = address(this).balance;
            owner().call{value: amount}("");
        }
        require(amount > 0);
        emit Withdraw(owner(), token, amount);
    }
}