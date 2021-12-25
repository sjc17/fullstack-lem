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
    <!-- Work Date -->
    <div class="row my-1">
      <div class="col-3"><label for="form-workdate">Work Date:</label></div>
      <div class="col">
        <input
          class="form-control"
          type="text"
          name="workdate"
          id="form-workdate"
        />
      </div>
    </div>
    <!-- Location -->
    <div class="row my-1">
      <div class="col-3"><label for="form-location">Location:</label></div>
      <div class="col">
        <input
          class="form-control"
          type="text"
          name="location"
          id="form-location"
        />
      </div>
    </div>
    <!-- Comments -->
    <div class="row my-1">
      <div class="col-3"><label for="form-comments">Comments:</label></div>
      <div class="col">
        <input
          class="form-control"
          type="text"
          name="comments"
          id="form-comments"
        />
      </div>
    </div>
    <!-- LEM Rows -->
    <div class="row">
      <div class="col">Item Code</div>
      <div class="col">Description</div>
      <div class="col">Work Order</div>
      <div class="col">Quantity</div>
    </div>
    <div v-for="row in lemRows" :key="lemRows.findIndex(() => row)" class="row">
      <div class="col">
        <select name="" :id="'row-'+lemRows.findIndex(() => row)">
          <option
            v-for="item in lemItems"
            :key="item.itemcode"
            :value="item.itemcode"
          >
            {{ item.itemcode }}
          </option>
        </select>
      </div>
      <div class="col">
        <!-- Need to figure out how to get the selected item code and then display the description here -->
        {{  }}
      </div>
      <div class="col">{{ row.workOrder }}</div>
      <div class="col">{{ row.quantity }}</div>
    </div>
  </form>
</template>

<script>
// import Alert from '../components/Alert.vue';
import defaultMethods from '../methods/dbMethods';
const { getPurchaseOrders, getCompanies, getLemItems } = defaultMethods;

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
      selectedCompany: {},
      lemRows: [
        {
          itemCode: '',
          workOrder: '',
          quantity: '',
          comment: '',
        },
      ],
      lemItems: [],
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
  },
  async created() {
    this.refreshCompanies();
    this.lemItems = await getLemItems();
    console.log(this.lemItems[0]);
  },
};
</script>
