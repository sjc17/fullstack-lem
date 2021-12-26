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

async function getPurchaseOrders(companyId = null) {
  try {
    const response = await axios.get('/api/purchaseorders', {
      params: {
        companyId
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

async function getLemItems(itemCode = null) {
  try {
    const response = await axios.get('/api/lemItems', {
      params: {
        itemCode
      }
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

async function addLemRow(parameters) {
  try {
    return await axios.post('/api/lemRows', parameters);    
  } catch (err) {
    console.log(err);
  }
}
async function addLem(parameters) {
  try {    
    return await axios.post('/api/lems', parameters);    
  } catch (err) {
    console.log(err);
  }
}



export default { getCompanies, getPurchaseOrders, getLemItems, addCompany, addPurchaseOrder, addLemRow, addLem }
