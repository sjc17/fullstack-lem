<template>
  <form class="timesheet container">
    <h1>Timesheet</h1>
  </form>
</template>

<script>
// import Alert from '../components/Alert.vue';
// import { getCompanies, getPurchaseOrders, addCompany, addPurchaseOrder } from '../methods/dbMethods'

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
      selectedCompany: {},
      selectedPO: {}
    }
  }
}
</script>