<template>
    <v-data-table
        :headers="headers"
        :items="beverage"
        sort-by="name"
        class="elevation-1"
        :search="search" 
        pagination.sync="pagination"
    >
        <template v-slot:top>
            <v-toolbar
                flat
            >
                <v-toolbar-title>DRINK TABLE</v-toolbar-title>
                
                <v-spacer></v-spacer>
                <v-divider
                    class="mx-4"
                    inset
                    vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="search"
                single-line
                hide-details
                class="mr-4"
                ></v-text-field>
                <v-dialog
                    v-model="dialog"
                    max-width="500px"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                    >
                        New Item
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                                >
                                    <v-text-field
                                        v-model="editedItem.name"
                                        label="Drink name"
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                                >
                                    <v-select
                                    :items="['Ice','Hot']"
                                    label="Ice / Hot"
                                    v-model="editedItem.icehot"
                                    ></v-select>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                                >
                                    <v-text-field
                                        v-model="editedItem.sugar"
                                        label="Sugar (g)"
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                                >
                                    <v-text-field
                                        v-model="editedItem.water"
                                        label="Water (g)"
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                                >
                                    <v-text-field
                                        v-model="editedItem.price"
                                        label="Price (g)"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="close"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="save"
                    >
                        Save
                    </v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                        <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                        <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
            >
                mdi-pencil
            </v-icon>
            <v-icon
                small
                @click="deleteItem(item)"
            >
                mdi-delete
            </v-icon>
        </template>
    </v-data-table>
</template>

<script>

    //tambahkan ini untuk import database reference
    import { bevRef } from '../firebase'

    export default {
        data: () => ({
            dialog: false,
            search:null,
            dialogDelete: false,
            headers: [
                {
                    text: 'Beverages (100g serving)',
                    align: 'start',
                    sortable: false,
                    value: 'name',
                },
                { text: 'Ice / Hot', value: 'icehot' },
                { text: 'Sugar (g)', value: 'sugar' },
                { text: 'Water (g)', value: 'water' },
                { text: 'Price (Rp)', value: 'price' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            beverage: [],
            editedIndex: -1,
            editedItem: {
                name: '',
                icehot: 0,
                sugar: 0,
                water: 0,
                price: 0,
            },
            defaultItem: {
                name: '',
                icehot: 0,
                sugar: 0,
                water: 0,
                price: 0,
            },
        }),

        //tambahkan attribute firebase disini
        firebase: {
            beverage: bevRef,
        },

        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
        },

        watch: {
            dialog (val) {
                val || this.close()
            },
            dialogDelete (val) {
                val || this.closeDelete()
            },
        },

        methods: {

            editItem (item) {
                this.editedIndex = item['.key']
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },

            deleteItem (item) {
                this.editedIndex = item['.key']
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            },

            deleteItemConfirm () {
                
                bevRef
                .child(this.editedIndex)
                .remove()
                .then(()=> {
                    alert("Berhasil delete data");
                })
                .catch((err) => [
                    alert('Gagal delete data',err)
                ])

                this.closeDelete()
            },

            close () {
                this.dialog = false
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                })
            },

            closeDelete () {
                this.dialogDelete = false
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                })
            },

            save () {
                if (this.editedIndex != -1) {

                    bevRef
                    .child(this.editedIndex)
                    .set(this.editedItem)
                    .then(()=>{
                        alert("Berhasil edit data !")
                    })
                    .catch((err) => [
                        alert("Gagal edit data", err)
                    ])

                } else {
                    bevRef
                    .push(this.editedItem) 
                    .then(() => {
                        alert("Berhasil tambah data !")
                    }) 
                    .catch((err) => [
                        alert("Gagal tambah data",err)
                    ])                  
                }
                this.close()
            },
        },
    }
</script>