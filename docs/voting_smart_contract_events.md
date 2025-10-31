// Solidity Voting Events and Function Example

/**
 * event ProposalCreated(string title, string[] options, uint256 endsAt);
 * event VoteSubmitted(address voter, uint256 proposalId, string option);
 *
 * function submitVote(uint256 proposalId, string memory option) public {
 *   require(block.timestamp < proposals[proposalId].endsAt, "Voting closed");
 *   votes[proposalId][msg.sender] = option;
 *   emit VoteSubmitted(msg.sender, proposalId, option);
 * }
 */

// Backend can listen to ProposalCreated and VoteSubmitted events
// and sync to backend or Firestore for real-time frontend updates.
