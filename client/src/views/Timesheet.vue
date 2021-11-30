<template>
  <form class="timesheet container">
    <h1>Timesheet</h1>
    <label for="selectPurchaseOrders" class="mt-3">Purchase Order:</label>
    <select
      name="purchaseOrders"
      id="selectPurchaseOrders"
      class="form-control form-select mb-3"
      v-model="selected"
    >
      <option
        v-for="po in purchaseOrders"
        :key="po.id"
        :value="{ name: po.name, id: po.id }"
      >
        {{ po['Company Name'] }} - {{ po['PO Number'] }}: {{ po['PO Name'] }} - {{ po['Value'] }}
      </option>
    </select>
  </form>
</template>

<script>
// import Alert from '../components/Alert.vue';
import defaultMethods from '../methods/dbMethods';
const { getPurchaseOrders } = defaultMethods;

export default {
  name: 'Timesheet',
  data() {
    return {
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
      selected: {},
    };
  },
  methods: {
    async refreshPOs() {
      this.purchaseOrders = await getPurchaseOrders();
      console.log(this.purchaseOrders)
    }
  },
  async created() {
    this.refreshPOs();
    //this.purchaseOrders = await getPurchaseOrders();
  },
};
</script>
