<template>
  <div class="purchaseorders container">
    <h1>Purchase Orders</h1>
    <label for="selectCompanies" class="mt-3">Client Company:</label>
    <select
      name="companies"
      id="selectCompanies"
      @change="refreshPOs"
      class="form-control form-select mb-3"
      v-model="selectedCompany"
    >
      <option
        v-for="company in companies"
        :key="company.id"
        :value="{ name: company.name, id: company.id }"
      >
        {{ company.name }}
      </option>
    </select>
    <div class="row">
      <label for="inputAddCompany" class="col-sm-2 col-form-label text-nowrap"
        >Add New Company:</label
      >
      <input
        type="text"
        name="addCompany"
        id="addCompany"
        class="form-control col-sm-8"
        v-model="newCompanyName"
      />
      <button
        type="button"
        id="btnAddCompany"
        class="btn btn-primary col-sm-2"
        @click="addCompany"
      >
        Add
      </button>
    </div>
    <div>Purchase Orders for {{ selectedCompany.name }}:</div>
    <ul class="mb-3">
      <li v-for="po in purchaseOrders" :key="po.id">
        {{ po['PO Number'] }}: {{ po['PO Name'] }} - {{ po['Value'] }}
      </li>
    </ul>
    <div class="form-group">
      <div class="row">
        <div class="col">
          New Purchase Order:
        </div>
      </div>
      <div class="row">
        <label for="addPONumber" class="col-sm-2 col-form-label text-nowrap"
          >PO Number:</label
        >
        <input
          type="text"
          name="addPONumber"
          id="addPONumber"
          class="form-control addPOinput"
          v-model="addPONumber"
        />
      </div>
      <div class="row">
        <label for="addPOName" class="col-sm-2 col-form-label text-nowrap"
          >PO Name:</label
        >
        <input
          type="text"
          name="AddPOName"
          id="addPOName"
          class="form-control addPOinput"
          v-model="addPOName"
        />
      </div>
      <div class="row">
        <label for="addPOValue" class="col-sm-2 col-form-label text-nowrap"
          >Value ($):</label
        >
        <input
          type="text"
          name="addPOValue"
          id="addPOValue"
          class="form-control addPOinput"
          v-model="addPOValue"
        />
      </div>
      <div class="row">
        <button class="btn btn-primary" @click="addPO">
          Create New Purchase Order
        </button>
      </div>
      <div class="row">
        <Alert
          v-for="alert in alerts"
          :key="alert.id"
          :message="alert.message"
          :isSuccess="alert.isSuccess"
          :isDanger="alert.isDanger"
          :close="alert.close"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Alert from '../components/Alert.vue';
import defaultMethods from '../methods/dbMethods'
const {getCompanies, getPurchaseOrders, addCompany, addPurchaseOrder} = defaultMethods;

export default {
  name: 'PurchaseOrders',
  components: {
    Alert,
  },
  data() {
    return {
      companies: [],
      purchaseOrders: [],
      // Array of objects to render alert labels
      alerts: [
        // {
        //   id: 1,
        //   message: 'Message',
        //   isSuccess: true,
        //   isDanger: false,
        //   close: () => {
        //     this.closeCallback(1);
        //   },
        // },
      ],
      alertCounter: 0,
      selectedCompany: {},
      addPOName: '',
      addPONumber: '',
      addPOValue: '',
      newCompanyName: '',
    };
  },
  methods: {
    // Get companies data from API
    async refreshCompanies() {
      this.companies = await getCompanies();
    },
    // Get Purchase Orders data from API
    async refreshPOs() {
      this.purchaseOrders = await getPurchaseOrders(this.selectedCompany.id);
    },
    // Create new company
    async addCompany() {
      if (!this.newCompanyName) {
        this.alerts.push({
          id: this.alertCounter,
          message: 'Company name must be non-empty.',
          isSuccess: false,
          isDanger: true,
          close: () => {
            this.closeCallback(this.alertCounter);
          },
        });
        ++this.alertCounter;
        return;
      }
      await addCompany(this.newCompanyName);
      await this.refreshCompanies();
      this.alerts.push({
        id: this.alertCounter,
        message: 'Company has been added!',
        isSuccess: true,
        isDanger: false,
        close: () => {
          this.closeCallback(this.alertCounter);
        },
      });
      ++this.alertCounter;
    },
    // Create new purchase order
    async addPO() {
      // Validation
      if (
        !this.selectedCompany ||
        !this.addPONumber ||
        !this.addPOName ||
        !this.addPOValue
      ) {
        this.alerts.push({
          id: this.alertCounter,
          message: 'Error validating input. Please check that company, PO number, name, and value are all non-empty values.',
          isSuccess: false,
          isDanger: true,
          close: () => {
            this.closeCallback(this.alertCounter);
          },
        });
        ++this.alertCounter;
        return;
      }
      const parameters = {
        number: this.addPONumber,
        name: this.addPOName,
        value: this.addPOValue,
        companyId: this.selectedCompany.id,
      };
      await addPurchaseOrder(parameters);
      this.refreshPOs();
      this.alerts.push({
        id: this.alertCounter,
        message: 'PO has been created!',
        isSuccess: true,
        isDanger: false,
        close: () => {
          this.closeCallback(this.alertCounter);
        },
      });
      ++this.alertCounter;
    },
    // Callback function for alert close button
    // Removes that specific alert object from alerts array
    closeCallback(id) {
      this.alerts.splice(
        this.alerts.findIndex((alert) => alert.id === id),
        1
      );
    },
  },
  async created() {
    this.refreshCompanies();
  },
};
</script>

<style>
.form-group > * {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.addPOinput {
  width: 83.333%;
}

#addCompany {
  width: 66.666%;
}
</style>
