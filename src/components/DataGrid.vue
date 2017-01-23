<template>
  <table>
     <thead>
       <tr>
         <th v-for="key in columns"
           @click="sortBy(key)"
           :class="{ active: sortKey == key }">
           {{ key | capitalize }}
           <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
           </span>
         </th>
       </tr>
     </thead>
     <tbody>
       <tr v-for="entry in filteredData">
         <td v-for="key in columns">
           {{entry[key]}}
         </td>
       </tr>
     </tbody>
   </table>
</template>

<script>
export default {
  name: 'data-grid',
  props: {
    data: Array,
    columns: Array,
    filterKey: String
  },
  data () {
    const sortOrders = {}
    this.columns.forEach(key => {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders
    }
  },
  computed: {
    filteredData () {
      const sortKey = this.sortKey
      const filterKey = this.filterKey && this.filterKey.toLowerCase()
      const order = this.sortOrders[sortKey] || 1
      let data = this.data
      if (filterKey) {
        data = data.filter(row =>
          Object.keys(row).some(key =>
            String(row[key]).toLowerCase().indexOf(filterKey) > -1))
      }
      if (sortKey) {
        data = data.slice().sort((a, b) => {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    }
  },
  filters: {
    capitalize (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    }
  }
}
</script>

<style lang="scss" scoped>
table {
  border: 2px solid #ccc;
  border-radius: 3px;
  background-color: #fff;
  margin: 0 auto;
}

th {
  background-color: #bbb;
  color: rgba(255,255,255,0.96);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  background-color: #f9f9f9;
}

th, td {
  min-width: 220px;
  padding: 10px 20px;
}

th.active {
  color: #fff;

  .arrow {
    opacity: 1;
  }
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;

  &.asc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid #fff;
  }

  &.dsc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #fff;
  }
}

</style>
