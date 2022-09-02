// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract IdeaTown {
    uint256 internal ideasLength = 0;
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Idea {
        address payable owner;
        string name;
        string description;
        uint256 rate;
        uint256 noOfsupports;
        uint256 donationAmount;
    }

    mapping(uint256 => Idea) private ideas;

    mapping(uint256 => bool) private exists;
    // keeps track of users that have already rated an idea
    mapping(uint256 => mapping(address => bool)) private rated;

    /// @dev ensures caller is not the idea's creator/owner
    modifier notCreator(uint256 _index) {
        require(msg.sender != ideas[_index].owner, "Can't rate your own idea");
        _;
    }
    /// @dev checks if idea exists
    modifier exist(uint256 _index) {
        require(exists[_index], "Query of nonexistent idea");
        _;
    }

    /**
     * @dev allow users to create an idea to receive feedback and support/critics from other users
     * @param _name is the name of the idea
     * @param _description is the text explaining the idea
     */
    function addIdea(string calldata _name, string calldata _description)
        external
    {
        require(bytes(_name).length > 0, "Empty name");
        require(bytes(_description).length > 0, "Empty description");
        uint256 _rate = 0;
        uint256 _noOfsupports = 0;
        uint256 _donationAmount = 0;
        ideas[ideasLength] = Idea(
            payable(msg.sender),
            _name,
            _description,
            _rate,
            _noOfsupports,
            _donationAmount
        );
        exists[ideasLength] = true;
        ideasLength++;
    }

    /**
     * @return data of an Idea
     */
    function getIdea(uint256 _index)
        public
        view
        exist(_index)
        returns (
            address payable,
            string memory,
            string memory,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            ideas[_index].owner,
            ideas[_index].name,
            ideas[_index].description,
            ideas[_index].rate,
            ideas[_index].noOfsupports,
            ideas[_index].donationAmount
        );
    }

    /**
     * @dev allow ideas' owners to remove their ideas
     * @notice only ideas' owners can remove their ideas
     */
    function removeIdea(uint256 _index) public exist(_index) {
        require(
            msg.sender == ideas[_index].owner,
            "Only the owner can remove idea"
        );
        ideas[_index] = ideas[ideasLength - 1];
        // idea's index is now ideasLength - 1
        exists[ideasLength - 1] = false;
        delete ideas[ideasLength - 1];
        ideasLength--;
    }

    /**
     * @dev allow users to rate an idea within the range of 0-5
     * @param rate is the choosen rate for caller for idea
     */
    function rateIdea(uint256 _index, uint256 rate)
        external
        exist(_index)
        notCreator(_index)
    {
        require(rate >= 0 && rate <= 5, "Rate has to be between 1 and 5");
        Idea storage currentIdea = ideas[_index];
        require(!rated[_index][msg.sender], "You have already rated this idea");
        uint256 totalRates = rate + currentIdea.rate;
        currentIdea.rate = totalRates;
        currentIdea.noOfsupports++;
        rated[_index][msg.sender] = true;
    }

    /// @dev supports an idea by donating @param _amount
    function supportIdea(uint256 _index, uint256 _amount)
        public
        payable
        exist(_index)
        notCreator(_index)
    {
        Idea storage currentIdea = ideas[_index];
        uint256 totalAmount = currentIdea.donationAmount + _amount;
        currentIdea.donationAmount = totalAmount;
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                ideas[_index].owner,
                _amount
            ),
            "Transfer failed."
        );
    }

    function getIdeasLength() public view returns (uint256) {
        return (ideasLength);
    }
}
