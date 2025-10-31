import express from 'express';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const proposalsFile = path.join(__dirname, '../data/vote_proposals.json');
const votesFile = path.join(__dirname, '../data/vote_votes.json');

function readJson(file: string): any[] {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
}
function writeJson(file: string, data: any[]): void {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// GET /api/vote/proposals
router.get('/proposals', (req, res) => {
  const proposals = readJson(proposalsFile);
  res.json(proposals);
});

// POST /api/vote/proposal
router.post('/proposal', (req, res) => {
  const { title, description, options, createdBy, votingEndsAt } = req.body;
  const proposals = readJson(proposalsFile);
  const newProposal = {
    id: uuidv4(),
    title,
    description,
    options,
    createdBy,
    votingEndsAt,
    createdAt: new Date().toISOString()
  };
  proposals.push(newProposal);
  writeJson(proposalsFile, proposals);
  res.json({ success: true, proposal: newProposal });
});

// POST /api/vote/submit
router.post('/submit', (req, res) => {
  const { proposalId, voter, option } = req.body;
  const votes = readJson(votesFile);
  votes.push({ proposalId, voter, option, timestamp: new Date().toISOString() });
  writeJson(votesFile, votes);
  res.json({ success: true });
});

// GET /api/vote/results
router.get('/results', (req, res) => {
  const { proposalId } = req.query;
  const votes = readJson(votesFile).filter(v => v.proposalId === proposalId);
  const tally: { [key: string]: number } = {};
  votes.forEach((v: any) => {
    tally[v.option] = (tally[v.option] || 0) + 1;
  });
  res.json({ proposalId, tally, totalVotes: votes.length });
});

export default router;
