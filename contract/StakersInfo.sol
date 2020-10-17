pragma solidity >=0.4.16 <0.7.0;

/**
 * @title StakersInfo
 */
contract StakersInfo {
    event SetValidatorInfoEvent(bytes32 indexed nodeID, bytes32 name, bytes32 website, bytes avatar, bytes bio, bytes link);
    event AddRatingEvent(bytes32 indexed nodeID, uint256 rating);

    address private admin;
    address private owner;

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
    
    mapping (bytes32 => Member) public members;
    mapping (bytes32 => bool) public  isUsed;
    mapping (bytes32 => bool) codes;

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not admin");
        _;
    }
    
    function addAdmin(address _admin)
        public
        onlyOwner() {
       admin = _admin;
    }
    
    function setValidatorInfo(
        bytes32 _nodeID,
        bytes32 _name,
        bytes32 _website,
        bytes memory _avatar,
        bytes memory  _bio,
        bytes memory _link)
        onlyAdmin()
        public {
            if (members[_nodeID].name != _name) {
                require(!isUsed[_name], 'The name is taken');

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
        bytes32  _data)
        onlyAdmin()
        public {
        codes[_data] = true;
    }
    
    function addRating(
        bytes32 _nodeID,
        uint256 _rating)
        onlyAdmin()
        public {
          members[_nodeID].rating = _rating;

          emit AddRatingEvent(_nodeID, _rating);
    }
    
    function isValidCode(
        bytes32  _data)
        public
        view
        returns(bool) {
          return codes[_data];
    }
}
