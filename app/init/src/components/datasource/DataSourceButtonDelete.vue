<template>
  <span>
    <button v-if="show" type="button" class="btn btn-danger float-right" data-toggle="modal" data-target="#ModalBoxDelete">
      Delete
    </button>

    <!-- Modal box to confirm deletion -->
    <modal-box-delete v-bind:objectType="'dataSource'" v-bind:objectId="dataSourceId"> </modal-box-delete>
  </span>
</template>

<script>
import ModalBoxDelete from "../utils/ModalBoxDelete.vue";
import Mixins from "../utils/Mixins.vue";

export default {
  mixins: [Mixins],
  components: {
    "modal-box-delete": ModalBoxDelete
  },
  props: {
    dataSourceId: Number
  },
  computed: {
    show() {
      let roles = ["advanced", "admin"];
      return Number.isInteger(this.dataSourceId) && roles.includes(this.$store.state.currentUser.role);
    }
  }
};
</script>
