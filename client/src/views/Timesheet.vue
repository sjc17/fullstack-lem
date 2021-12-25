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
    <div class="row my-1">
      <div class="col">Work Order</div>
      <div class="col">Item Code</div>
      <div class="col">Description</div>
      <div class="col">Quantity</div>
      <div class="col">Rate</div>
      <div class="col">Total</div>
      <div class="col"></div>
    </div>
    <div v-for="row in lemRows" :key="row.localId" class="lemRow row my-1 py-1">
      <div class="col col-input">
        <input type="text" name="" id="" v-model="row.workOrder" />
      </div>
      <div class="col">
        <select name="" v-model="row.itemCode">
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
        <!-- If item code is selected, lookup description of work item. Otherwise, use blank. -->
        {{
          !row.itemCode
            ? ''
            : this.lemItems.find((element) => element.itemcode == row.itemCode)
                .description
        }}
      </div>
      <div class="col col-input">
        <input type="number" name="" id="" v-model="row.quantity" step="0.5" />
      </div>
      <div class="col">
        <!-- If item code is selected, lookup rate. Otherwise, use 0. -->
        {{
          !row.itemCode
            ? 0
            : this.lemItems.find((element) => element.itemcode == row.itemCode)
                .rate
        }}
      </div>
      <div class="col">
        <!-- If item code is selected, calculate total. Otherwise, use 0. -->
        {{
          !row.itemCode
            ? 0
            : new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: 'USD',
              }).format(
                parseFloat(
                  this.lemItems
                    .find((element) => element.itemcode == row.itemCode)
                    .rate.replace('$', '')
                ) * row.quantity
              )
        }}
      </div>
      <div class="col">
        <i class="bi bi-trash" @click="deleteRow(row.localId)"></i>
      </div>
    </div>
    <div class="row my-1">
      <div class="col">Totals:</div>
      <div class="col"></div>
      <div class="col"></div>
      <div class="col">
        {{ this.lemRows.reduce((sum, row) => sum + row.quantity, 0) }}
      </div>
      <div class="col"></div>
      <div class="col"></div>
      <div class="col">
      </div>
    </div>
    <div class="d-flex justify-content-center my-3">
      <i class="bi bi-plus-square" @click="addRow"></i>
    </div>
  </form>
</template>

<style scoped>
/* Padding causes the column divs containing inputs to overflow. This will address it. */
.col-input {
  padding-left: 0;
  padding-right: 0;
}
/* LEM Rows styling */
.lemRow {
  border-top: solid rgba(175, 175, 175) 1px;
  border-top: solid rgba(175, 175, 175) 1px;
}
/* Show icons as clickable */
.bi:hover {
  opacity: 50%;
  cursor: pointer;
}
</style>

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
          localId: 0,
          workOrder: '',
          itemCode: null,
          quantity: 0,
        },
      ],
      lemItems: [],
      counter: 1,
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
    // Add LEM Row
    addRow() {
      // Append new row to the row array. We identify each row with a local ID to ensure
      // no identity issues when deleting rows. Rows are tracked in the counter variable.
      this.lemRows.push({
        localId: this.counter++,
        workOrder: '',
        itemCode: null,
        quantity: 0,
      });
    },
    deleteRow(rowId) {
      this.lemRows.pop((row) => row.localId == rowId);
    },
  },
  async created() {
    // Populate companies dropdown
    this.refreshCompanies();

    // Get all LEM Item codes
    this.lemItems = await getLemItems();
  },
};
</script>
