<template>
    <div>
        <headerCom class="header" :color="'#fff'"></headerCom>
        <div class="mian">
            您访问的页面不在了！
        </div>
        <footerCom></footerCom>
    </div>    
</template>
<script>
import headerCom from "../../components/common/header";
import footerCom from "../../components/common/footer";
export default {
    components:{
        headerCom,
        footerCom
    }
}
</script>
<style scoped>
    .mian{
        width: 100%;
        height: 855px;
        background: #f9f9f9;
        font-size: 16px;
        text-align: center;
        line-height: 855px;
    }
    .header {
        background: #0074ff;
    }
</style>
