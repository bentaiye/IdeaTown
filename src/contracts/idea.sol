// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract IdeaTown {

    uint internal ideasLength = 0;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Idea {
        address payable owner;
        string name;
        string description;
        uint perfect;
        uint good;
        uint bad;
        uint noOfsupports;
    }

    mapping (uint => Idea) internal ideas;

    function addIdea(
        string memory _name,
        string memory _description
    ) public {
        uint _perfect = 0;
        uint _good = 0;
        uint _bad = 0;
        uint _noOfsupports = 0;
        ideas[ideasLength] = Idea(
            payable(msg.sender),
            _name,
            _description,
            _perfect,
            _good,
            _bad,
            _noOfsupports
        );
        ideasLength++;
    }

    function getIdea(uint _index) public view returns (
        address payable,
        string memory, 
        string memory,  
        uint,
        uint,  
        uint,
        uint
    ) {
        return (
            ideas[_index].owner,
            ideas[_index].name,  
            ideas[_index].description, 
            ideas[_index].perfect,
            ideas[_index].good,
            ideas[_index].bad,
            ideas[_index].noOfsupports
           
        );
    }

     function removeIdea(uint _index) external {
	        require(msg.sender == ideas[_index].owner, "Only the owner can remove idea");         
            ideas[_index] = ideas[ideasLength - 1];
            delete ideas[ideasLength - 1];
            ideasLength--; 
	 }

      function perfect(uint _index) external {
	        require(msg.sender != ideas[_index].owner, "Can't rate your own idea");         
            ideas[_index].perfect++;
	 }
      function good(uint _index) external {
	        require(msg.sender != ideas[_index].owner, "Can't rate your own idea");         
            ideas[_index].good++;
	 }
      function bad(uint _index) external {
	        require(msg.sender != ideas[_index].owner, "Can't rate your own idea");         
            ideas[_index].bad++;
	 }

    function supportIdea(uint _index, uint _ammount) public payable  {
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            ideas[_index].owner,
           _ammount
          ),
          "Transfer failed."
        );
        ideas[_index].noOfsupports++;
    }
    
    function getIdeasLength() public view returns (uint) {
        return (ideasLength);
    }
}