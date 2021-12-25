<template>
  <form class="timesheet container">
    <h1>Timesheet</h1>
    <label for="selectCompanies" class="">Client Company:</label>
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
    <label for="selectPurchaseOrders" class="">Purchase Order:</label>
    <select
      name="purchaseOrders"
      id="selectPurchaseOrders"
      class="form-control form-select mb-3"
      v-model="selectedPO"
    >
      <option
        v-for="po in purchaseOrders"
        :key="purchaseOrders.indexOf(po)"
        :value="{ po }"
      >
        {{ po['PO Number'] }}: {{ po['PO Name'] }} - {{ po['Value'] }}
      </option>
    </select>
  </form>
</template>

<script>
// import Alert from '../components/Alert.vue';
import defaultMethods from '../methods/dbMethods';
const { getPurchaseOrders, getCompanies } = defaultMethods;

export default {
  name: 'Timesheet',
  data() {
    return {
      companies: [],
      purchaseOrders: [],
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
      selectedPO: {},
      selectedCompany: {}
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
    }
  },
  async created() {
    this.refreshCompanies();
    //this.purchaseOrders = await getPurchaseOrders();
  },
};
</script>
