<!--
  @author: LEE
  @file: index.vue
  @create: 2023-07-27 17:20:42
  @last-modifier: LEE
  @last-modify: 2023-07-27 17:20:42
-->
<template>
    <div class="container">
        <div class="mb-3">
            <div>
                <h3 for="transactionHash" class="form-label">
                    {{ title }}
                </h3>
                <input
                    type="text"
                    v-model="trxHash"
                    class="form-control"
                    id="transactionHash"
                    placeholder="Input transaction hash"
                />
                <button v-on:click="feetData" class="btn btn-primary mt-3">
                    Submit
                </button>
            </div>
        </div>
        <!-- Display the API response data -->
        <div v-if="responseClean.requestStatus === true">
            <div class="alert alert-success" role="alert">
                <p>
                    <strong> Transaction Hash : </strong>
                    {{ responseClean.trxHash }}
                </p>
                <p>
                    <strong> Sender Address : </strong>
                    {{ responseClean.senderAddress }}
                </p>
                <p>
                    <strong> Reciever Address : </strong>
                    {{ responseClean.receiverAddress }}
                </p>
                <p>
                    <strong> Amount : </strong>
                    {{ responseClean.trxAmount }}
                </p>
                <p>
                    <strong> Gass Price : </strong>
                    {{ responseClean.trxGasPrice }}
                </p>
                <p>
                    <strong> Status : </strong>
                    {{ responseClean.trxStatus }}
                </p>
                <p>
                    <strong> Request Origin : </strong>
                    {{ responseOrigin }}
                </p>
            </div>
        </div>
        <div v-if="responseClean.requestStatus === false">
            <div class="alert alert-danger" role="alert">Invalid request!</div>
        </div>
    </div>
</template>
<script>
import { getInfo } from "@/api/transaction-info.js";
export default {
    name: "vue-transaction",
    data() {
        return {
            title: "Tron Transaction Detail",
            trxHash: null,
            transactionHash: "",
            responseData: null,
            responseClean: {
                trxStatus: null,
                trxHash: null,
                senderAddress: null,
                receiverAddress: null,
                trxAmount: null,
                trxGasPrice: null,
                requestStatus: null,
            },
            responseOrigin: null,
        };
    },
    methods: {
        getPropertyVal(propertyName, obj) {
            try {
                return obj[propertyName];
            } catch (error) {
                return null;
            }
        },
        feetData() {
            const trx_hash = this.trxHash;
            if (trx_hash) {
                const trxHistory = JSON.parse(
                    window.localStorage.getItem("trxHistory") || "{}"
                );
                const params = { hash: encodeURIComponent(trx_hash) };
                const localObj = this.getPropertyVal(trx_hash, trxHistory);

                if (localObj) {
                    this.responseClean = localObj;
                    this.responseOrigin = "local";
                } else {
                    getInfo(params)
                        .then((res) => {
                            console.log("xx", res);
                            if (res.data.data === undefined) {
                                this.responseClean.requestStatus = false;
                                return;
                            }
                            const data = res.data;
                            this.responseData = data;
                            this.responseClean.trxStatus =
                                data.confirmed == true
                                    ? "Confirmed"
                                    : "Unconfirmed";
                            this.responseClean.trxHash = data.hash;
                            this.responseClean.senderAddress =
                                data.ownerAddress;
                            this.responseClean.receiverAddress = data.toAddress;
                            this.responseClean.trxAmount = `${
                                data.contractData.amount / 1000000
                            } TRX`;
                            this.responseClean.trxGasPrice = `${
                                data.cost.net_fee_cost / 1000000
                            } TRX`;
                            this.responseClean.requestStatus = true;
                            this.responseOrigin = "online";

                            trxHistory[trx_hash] = this.responseClean;
                            window.localStorage.setItem(
                                "trxHistory",
                                JSON.stringify(trxHistory)
                            );
                        })
                        .catch((error) => {
                            this.responseClean.requestStatus = false;
                            console.error("Error fetching data :", error);
                        });
                }
            } else {
                console.log("error trx hash : ", trx_hash);
            }
        },
    },
};
</script>
<style></style>
