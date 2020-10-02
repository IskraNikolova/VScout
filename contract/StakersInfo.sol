pragma solidity >=0.4.16 <0.7.0;

/**
 * @title StakersInfo
 */
contract StakersInfo {
    event SetValidatorInfoEvent(string indexed nodeID, bytes32 name, bytes avatar, bytes bio, bytes link);
    event AddRatingEvent(string indexed nodeID, uint256 rating);

    address private admin;
    address owner;

    constructor() public {
        owner = msg.sender;
    }

    struct Member {
        uint256 rating;
        bytes32 name;
        bytes avatar;
        bytes bio;
        bytes link;
    }
    
    mapping (string => Member) public members;
    mapping (bytes32 => bool) public  isUsed;

    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }
    
    modifier isAdmin() {
        require(msg.sender == admin, "Not permission" );
        _;
    }
    
    function addAdmin(address _admin)
        public
        isOwner(){
       admin = _admin;
    }
    
    function setValidatorInfo(
        string memory _nodeID,
        bytes32 _name,
        bytes memory _avatar,
        bytes memory  _bio,
        bytes memory _link)
        isAdmin()
        public 
        {
            if (members[_nodeID].name != _name) {
                require(!isUsed[_name]);

                members[_nodeID].name = _name;
                isUsed[members[_nodeID].name] = false;
                isUsed[_name] = true;
            }

            members[_nodeID].avatar = _avatar;
            members[_nodeID].bio = _bio;
            members[_nodeID].link = _link;

            emit SetValidatorInfoEvent(_nodeID, _name, _avatar, _bio, _link);
    }
    
    function addRating(
        string memory _nodeID,
        uint256 _rating)
        isAdmin()
        public 
        {
          members[_nodeID].rating = _rating;

           emit AddRatingEvent(_nodeID, _rating);
    }
}
