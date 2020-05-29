pragma solidity >=0.4.16 <0.7.0;

/**
 * @title Validators
 */
contract Validators {
    event AddValidatorEvent(bytes32 indexed id, bytes32 name, bytes avatarUrl, bytes link);
    event UpdateValidatorEvent(bytes32 indexed id, bytes32 name, bytes avatarUrl, bytes link);
    
    struct Member {
        bytes32 name;
        bytes avatarUrl;
        bytes link;
    }

    mapping (bytes32 => Member) public members;

    function addValidator(bytes32 id, bytes32 name, bytes memory avatarUrl, bytes memory link)
        public {

        members[id] = Member(name, avatarUrl, link);
        emit AddValidatorEvent(id, name, avatarUrl, link);
    }
    
    function getValidatorById (bytes32 id) 
      public
      view
      returns(bytes32, bytes memory, bytes memory) {
        return (members[id].name, members[id].avatarUrl, members[id].link);
    }
    
    function updateValidator(bytes32 id, bytes32 name, bytes memory avatarUrl, bytes memory link) 
        public {
        members[id].name = name;
        members[id].avatarUrl = avatarUrl;
        members[id].link = link;

        emit UpdateValidatorEvent(id, name, avatarUrl, link);
    }
}
