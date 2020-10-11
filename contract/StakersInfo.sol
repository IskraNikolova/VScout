pragma solidity >=0.4.16 <0.7.0;

/**
 * @title StakersInfo
 */
contract StakersInfo {
    event SetValidatorInfoEvent(string indexed nodeID, bytes32 name, bytes32 website, bytes avatar, bytes bio, bytes link);
    event AddRatingEvent(string indexed nodeID, uint256 rating);

    address private admin;
    address owner;

    constructor() public {
        owner = msg.sender;
    }

    struct Member {
        uint256 rating;
        bytes32 name;
        bytes32 website;
        bytes avatar;
        bytes bio;
        bytes link;
    }
    
    mapping (string => Member) public members;
    mapping (bytes32 => bool) public  isUsed;
    mapping (bytes32 => mapping(string => bool)) codes;

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not admin");
        _;
    }
    
    modifier hasPermision(bytes32 _code, string memory _nodeID) {
        require(msg.sender == admin || isValidCode(_code, _nodeID), "Not permission" );
        _;
    }
    
    function addAdmin(address _admin)
        public
        onlyOwner() {
       admin = _admin;
    }
    
    function setValidatorInfo(
        string memory _nodeID,
        bytes32 _name,
        bytes32 _website,
        bytes memory _avatar,
        bytes memory  _bio,
        bytes memory _link,
        bytes32 _code)
        hasPermision(_code, _nodeID)
        public {
            if (members[_nodeID].name != _name) {
                require(!isUsed[_name]);

                members[_nodeID].name = _name;
                isUsed[members[_nodeID].name] = false;
                isUsed[_name] = true;
            }
            
            members[_nodeID].website = _website;
            members[_nodeID].avatar = _avatar;
            members[_nodeID].bio = _bio;
            members[_nodeID].link = _link;

            emit SetValidatorInfoEvent(_nodeID, _name, _website, _avatar, _bio, _link);
    }
    
    function setPermissionCode(
        string memory _nodeID,
        bytes32 _code)
        onlyAdmin()
        public {
        codes[_code][_nodeID] = true;
    }
    
    function addRating(
        string memory _pAddress,
        string memory _nodeID,
        uint256 _rating,
        bytes32 _code)
        hasPermision(_code, _pAddress)
        public {
          members[_nodeID].rating = _rating;

          emit AddRatingEvent(_nodeID, _rating);
    }
    
    function isValidCode(
        bytes32 _code,
        string memory _nodeID)
        public
        view
        returns(bool) {
          return codes[_code][_nodeID];
    }
}
