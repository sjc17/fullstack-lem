import axios from 'axios';

async function getCompanies() {
  try {
    const response = await axios.get('/api/companies', {});
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

async function getPurchaseOrders() {
  try {
    const response = await axios.get('/api/purchaseorders', {
      params: {
        companyId: this.selected.id,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

async function addCompany(newCompanyName) {
  try {
    // Validation
    if (!newCompanyName) return;
    await axios.post('/api/companies', {
      companyName: newCompanyName,
    });
  } catch (err) {
    console.log(err);
  }
}

async function addPurchaseOrder(parameters) {
  try {
    await axios.post('/api/purchaseorders', parameters);    
  } catch (err) {
    console.log(err);
  }
}

export default { getCompanies, getPurchaseOrders, addCompany, addPurchaseOrder }
