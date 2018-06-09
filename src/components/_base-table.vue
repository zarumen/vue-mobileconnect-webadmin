<script>
export default {
  props: {
    headers: {
      type: Array,
      default: () => ({}),
    },
    items: {
      type: [Array, Object],
      default: () => ({}),
    },
    pagination: {
      type: [Object, String],
      default: '',
    },
  },
  data () {
    return {
      search: ''
    }
  },
  computed: {
    isNotEmpty () {
      return this.items && this.items.length > 0;
    }
  },
  methods: {
    renderData: (item, header) => {
      let val = ''
      if (header.value.includes('.')) {
        const vals = header.value.split('.')
        val = vals.reduce((acc, val) => acc[val], item)
      } else {
        val = item[header.value]
      }
      if (typeof val === 'boolean') {
        val = val ? 'Yes' : 'No'
      }
      return val;
    }
  },
  
}
</script>

<template>
  <div>
    <v-data-table 
      :headers="headers" 
      :items="items" 
      :search="search" 
      :pagination="pagination"
      class="elevation-1"
      hide-actions
    >
      <template 
        slot="headers" 
        slot-scope="props"
      >
        <tr>
          <th 
            v-for="(header, index) in props.headers" 
            :key="header.text"
            :class="['column', 'subheading' , index === 0? 'text-xs-left': 'text-xs-center']"
          >
            {{ header.text }}
          </th>
          <th/>
        </tr>
      </template>
      <template 
        slot="items" 
        slot-scope="props"
        class="body-2" 
      >
        <td  
          v-for="(header, index) in headers"
          v-if="header.value!==''"
          :key="index"
          :class="[ index === 0? 'text-xs-left': 'text-xs-center', 'body-2']"
        >
          {{ renderData(props.item, header) }}
        </td>
        <td class="text-xs-right">
          <v-btn 
            class="green" 
            flat
            icon
            @click.native="$emit('edit', props.item)"
          >
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn 
            class="indigo" 
            flat
            icon 
            @click.native="$emit('remove', props.item)"
          >
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <span >
          <p class="pt-2 blue--text subheading">   
            <v-icon 
              medium 
              class="blue--text" 
            >
              info
            </v-icon>
            Sorry, nothing to display here :(</p>
        </span>
      </template>
    </v-data-table>
    <!-- footer page running page number -->
    <div
      v-if="isNotEmpty"
      class="text-xs-center pt-2"
    >
      <v-pagination 
        v-model="pagination.page" 
        :length="pagination.pages" 
        :total-visible="5" 
        circle
      />
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
