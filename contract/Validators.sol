pragma solidity >=0.4.16 <0.7.0;

/**
 * @title Validators
 */
contract Validators {
    event SetValidatorInfoEvent(string indexed id, bytes32 name, bytes avatar, bytes bio, bytes link);

    uint256 private permission;
    address private admin;
    address owner;

    constructor() public {
        permission = random();
        owner = msg.sender;
    }

    struct Member {
        bytes32 name;
        bytes avatar;
        bytes bio;
        bytes link;
    }
    
    mapping (string => Member) public members;

    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }
    
    modifier isAdmin() {
        require(msg.sender == admin, "Not permission" );
        _;
    }
    
    modifier hasAccess(uint256 _code) {
        require(permission == _code, 'Not permission');
        _;
    }

    function addAdmin(address _admin)
        public
        isOwner(){
       admin = _admin;
    }
    
    function setValidatorInfo(
        string memory _id,
        bytes32 _name,
        bytes memory _avatar,
        bytes memory  _bio,
        bytes memory _link,
        uint256 _code)
        hasAccess(_code)
        public 
        {
        members[_id] = Member(_name, _avatar, _bio, _link);

        permission = random();
        emit SetValidatorInfoEvent(_id, _name, _avatar, _bio, _link);
    }
    
    function getPermissionCode () 
      public
      view
      isAdmin()
      returns(uint256) {
        return permission;
    }

    function random() private view returns (uint256) {
       return uint256(keccak256(abi.encodePacked(now, block.difficulty, msg.sender))) % 9999;
    }
}
