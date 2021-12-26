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
        :value="po"
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
          type="date"
          name="workdate"
          id="form-workdate"
          v-model="this.workDate"
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
          v-model="this.location"
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
          v-model="this.comments"
        />
      </div>
    </div>
    <!-- LEM Rows -->
    <div class="lemRow row my-1">
      <div class="col">Work Order</div>
      <div class="col">Item Code</div>
      <div class="col">Description</div>
      <div class="col">Quantity</div>
      <div class="col">Rate</div>
      <div class="col">Total</div>
      <div class="col"></div>
    </div>
    <div v-for="row in lemRows" :key="row.localId" class="lemRow row my-1 py-1">
      <!-- Work Order -->
      <div class="col col-input">
        <input type="text" name="" id="" v-model="row.workOrder" />
      </div>
      <!-- Item Code (Dropdown) -->
      <div class="col">
        <select
          name=""
          v-model="row.itemCode"
          @change="
            updateRow({
              rowId: row.localId,
              newItemCode: row.itemCode,
            })
          "
        >
          <option
            v-for="item in lemItems"
            :key="item.itemcode"
            :value="item.itemcode"
          >
            {{ item.itemcode }}
          </option>
        </select>
      </div>
      <!-- Description -->
      <div class="col">
        {{ row.description }}
      </div>
      <!-- Quantity -->
      <div class="col col-input">
        <input type="number" name="" id="" v-model="row.quantity" step="0.5" />
      </div>
      <!-- Rate -->
      <div class="col">
        {{ '$' + row.rate.toFixed(2) }}
      </div>
      <!-- Total (Calculated) -->
      <div class="col">
        {{ '$' + (row.quantity * row.rate).toFixed(2) }}
      </div>
      <!-- Delete Row Button -->
      <div class="col">
        <i
          class="bi bi-trash"
          @click="
            deleteRow(
              this.lemRows.findIndex(
                (element) => element.localId == row.localId
              )
            )
          "
        ></i>
      </div>
    </div>
    <!-- Bottom row for totals -->
    <!-- The empty col divs maintain spacing -->
    <div class="lemRow row my-1">
      <div class="col">LEM Totals:</div>
      <div class="col"></div>
      <div class="col"></div>
      <!-- Total Quantity -->
      <div class="col">
        {{ this.lemRows.reduce((sum, row) => sum + row.quantity, 0) }}
      </div>
      <div class="col"></div>
      <!-- Total Cost -->
      <div class="col">
        {{
          '$' +
            this.lemRows
              .reduce((sum, row) => sum + row.quantity * row.rate, 0)
              .toFixed(2)
        }}
      </div>
      <div class="col"></div>
    </div>
    <!-- Add Row Button -->
    <div class="d-flex justify-content-center my-3">
      <i class="bi bi-plus-square" @click="addRow"></i>
    </div>
    <!-- Submit LEM Button -->
    <div class="d-flex justify-content-center my-3">
      <button type="button" @click="submitLEM">Submit LEM</button>
    </div>
    <!-- Alerts -->
    <Alert
      v-for="alert in alerts"
      :key="alert.id"
      :message="alert.message"
      :isSuccess="alert.isSuccess"
      :isDanger="alert.isDanger"
      :close="alert.close"
    />
  </form>
</template>

<style scoped>
/* Fixes input sizing issues with Bootstrap */
input,
select {
  width: 100%;
}
/* LEM Rows styling */
.lemRow {
  border-bottom: solid rgba(175, 175, 175) 1px;
}
/* Show icons as clickable */
.bi:hover {
  opacity: 50%;
  cursor: pointer;
}
</style>

<script>
import Alert from '../components/Alert.vue';
import defaultMethods from '../methods/dbMethods';
const {
  getPurchaseOrders,
  getCompanies,
  getLemItems,
  addLem,
  addLemRow,
} = defaultMethods;

export default {
  name: 'Timesheet',
  components: {
    Alert
  },
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
      alertCounter: 0,
      selectedPO: {},
      selectedCompany: {},
      lemRows: [
        {
          localId: 0,
          workOrder: '',
          itemCode: null,
          description: '',
          quantity: 0,
          rate: 0,
        },
      ],
      workDate: null,
      location: '',
      comments: '',
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
        description: '',
        quantity: 0,
        rate: 0,
      });
    },
    // Delete row. NOTE: Using index of row in row array, NOT ID
    deleteRow(rowIndex) {
      this.lemRows.splice(rowIndex, 1);
    },
    // Triggers when user selects a new item code from the dropdown.
    updateRow(params) {
      const { rowId, newItemCode } = params;
      // Get reference to row to be updated
      const updatedRow = this.lemRows.find((row) => row.localId == rowId);
      // Get new LEM Item for row
      const newLemItem = this.lemItems.find(
        (item) => item.itemcode == newItemCode
      );

      // Update row's properties
      updatedRow.itemCode = newItemCode;
      updatedRow.description = newLemItem.description;
      // Rate will be saved as a float, not a string with "$"
      updatedRow.rate = parseFloat(
        this.lemItems
          .find((element) => element.itemcode == newItemCode)
          .rate.replace('$', '')
      );
    },
    async submitLEM() {
      // Validate form inputs
      if (
        !this.selectedCompany ||
        !this.selectedPO ||
        !this.workDate ||
        this.location.trim() == ''
      )
      {
        this.alerts.push({
          id: this.alertCounter,
          message: 'Input validation error. Please check that company, PO, work date, and location are all non-empty values.',
          isSuccess: false,
          isDanger: true,
          close: () => {
            this.closeCallback(this.alertCounter);
          },
        });
        ++this.alertCounter;
        return;
      }
      // Validate LEM Row items
      for (const row of this.lemRows) {
        if (row.workOrder.trim() == '' || row.itemCode.trim() == '') {
          this.alerts.push({
            id: this.alertCounter,
            message: 'Input validation error. Please check that all of the items in the LEM are coded to a work order and item code.',
            isSuccess: false,
            isDanger: true,
            close: () => {
              this.closeCallback(this.alertCounter);
            },
          });
          ++this.alertCounter;
          return;
        }
      }
      // Create new LEM
      console.log('PO selected: ' + this.selectedPO);
        const newLemId = (
          await addLem({
            purchaseOrderId: this.selectedPO['PO ID'],
            workDate: this.workDate,
            location: this.location,
            comments: this.comments,
          })
        ).data[0].id;        
        console.log('New LEM id: ' + newLemId);

      // Create LEM rows all related to the new LEM
      for (const element of this.lemRows) {
        addLemRow({
          LEMid: newLemId,
          itemCode: element.itemCode,
          workOrder: element.workOrder,
          quantity: element.quantity,
        });
      }

      // Alert success
      this.alerts.push({
        id: this.alertCounter,
        message: 'LEM has been submitted!',
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
    // Populate companies dropdown
    this.refreshCompanies();

    // Get all LEM Item codes
    this.lemItems = await getLemItems();
  },
};
</script>
