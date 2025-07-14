// Load environment variables (like DB connection)
require('dotenv').config();

// Import required libraries
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const generateChequePDF = require('./generateCheque');

// Create app and Prisma instance
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json()); // Allow JSON in requests

// Dummy login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ message: 'Logged in', role: user.role });
});

// Get list of companies
app.get('/api/companies', async (req, res) => {
  const companies = await prisma.company.findMany();
  res.json(companies);
});

// Get banks for a company
app.get('/api/banks/:companyId', async (req, res) => {
  const { companyId } = req.params;
  const banks = await prisma.bank.findMany({
    where: { companyId: parseInt(companyId) },
  });
  res.json(banks);
});

// Get accounts for a bank
app.get('/api/accounts/:bankId', async (req, res) => {
  const { bankId } = req.params;
  const accounts = await prisma.account.findMany({
    where: { bankId: parseInt(bankId) },
  });
  res.json(accounts);
});

// Get last printed cheque number
app.get('/api/last-cheque/:accountId', async (req, res) => {
  const { accountId } = req.params;
  const account = await prisma.account.findUnique({
    where: { id: parseInt(accountId) },
  });
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }
  res.json({ lastCheque: account.lastCheck });
});

app.post('/api/templates', async (req, res) => {
    const { name, companyId, bankId, background, fieldMap } = req.body;
    const existing = await prisma.chequeTemplate.findFirst({
      where: { companyId, bankId }
    });
  
    if (existing) {
      const updated = await prisma.chequeTemplate.update({
        where: { id: existing.id },
        data: { name, background, fieldMap },
      });
      return res.json(updated);
    } else {
      const created = await prisma.chequeTemplate.create({
        data: { name, companyId, bankId, background, fieldMap },
      });
      return res.json(created);
    }
  });
  
  app.get('/api/templates/:companyId/:bankId', async (req, res) => {
    const { companyId, bankId } = req.params;
    const template = await prisma.chequeTemplate.findFirst({
      where: {
        companyId: parseInt(companyId),
        bankId: parseInt(bankId),
      },
    });
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json(template);
  });

// Generate cheques in batches
app.post('/api/generate', async (req, res) => {
  try {
    const { accountId, count } = req.body;
    
    // Get account and company info
    const account = await prisma.account.findUnique({
      where: { id: parseInt(accountId) },
      include: {
        bank: {
          include: {
            company: true
          }
        }
      }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const startNumber = account.lastCheck + 1;
    const batches = Math.ceil(count / 10);
    const generatedFiles = [];

    for (let i = 0; i < batches; i++) {
      const batchStart = startNumber + (i * 10);
      const batchEnd = Math.min(batchStart + 9, startNumber + count - 1);
      const batchCount = batchEnd - batchStart + 1;

      // Generate PDF for this batch
      const pdfPath = await generateChequePDF(accountId, batchCount);
      generatedFiles.push({
        path: pdfPath,
        startNumber: batchStart,
        endNumber: batchEnd
      });
    }

    // Update last cheque number
    await prisma.account.update({
      where: { id: parseInt(accountId) },
      data: { lastCheck: startNumber + count - 1 }
    });

    res.json({
      message: 'Cheques generated successfully',
      files: generatedFiles
    });
  } catch (error) {
    console.error('Error generating cheques:', error);
    res.status(500).json({ error: 'Failed to generate cheques' });
  }
});

// Start the server
app.listen(3000, () =>
  console.log('✅ API server running at http://localhost:3000')
);
