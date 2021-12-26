<template>
  <div class="lems container">
    <h1>LEMs</h1>
    <label for="selectCompanies" class="">Client Company:</label>
    <select
      name="companies"
      id="selectCompanies"
      class="form-control form-select mb-3"
      v-model="selectedCompany"
      @change="refreshPOs"
    >
      <option
        v-for="company in companies"
        :key="company.id"
        :value="{ name: company.name, id: company.id }"
      >
        {{ company.name }}
      </option>
    </select>
    <label for="selectPurchaseOrders" class="">Purchase Order:</label>
    <select
      name="purchaseOrders"
      id="selectPurchaseOrders"
      class="form-control form-select mb-3"
      v-model="selectedPO"
      @change="refreshLEMs"
    >
      <option
        v-for="po in purchaseOrders"
        :key="purchaseOrders.indexOf(po)"
        :value="po"
      >
        {{ po['PO Number'] }}: {{ po['PO Name'] }} - {{ po['Value'] }}
      </option>
    </select>
    <label for="selectLEMs" class="">LEM:</label>
    <select
      name="LEMs"
      id="selectLEMs"
      class="form-control form-select mb-3"
      v-model="selectedLem"
    >
      <option v-for="lem in lems" :key="lem['id']">
        {{ lem.workdate.substring(0, 10) }} - {{ lem.location }} -
        {{ lem.comments }}
      </option>
    </select>
  </div>
</template>

<script>
import defaultMethods from '../methods/dbMethods';
const { getPurchaseOrders, getCompanies, getLems } = defaultMethods;

export default {
  name: 'LEMs',
  components: {
    //Alert,
  },
  data() {
    return {
      companies: [],
      purchaseOrders: [],
      lems: [],
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
      selectedPO: {},
      selectedCompany: {},
      selectedLem: {},
      selectedLemRows: [],
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
    async refreshLEMs() {
      console.log(this.selectedPO['PO ID']);
      this.lems = await getLems(this.selectedPO['PO ID']);
      console.log(this.lems);
    },
  },
  async created() {
    // Populate companies dropdown
    this.refreshCompanies();
  },
};
</script>

<style></style>
