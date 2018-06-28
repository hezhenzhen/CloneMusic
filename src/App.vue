<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import 'reset-css'
.m-auto{ margin-left: auto;  margin-right: auto;}
.m-10{ margin: 10px; }
html,body,#app{ height: 100%;}
ul, ul li{ list-style: none; }
.clearfix:after{
  content: '';
  display: block;
  height: 0;
  clear: both;
}
/*align*/
.t-a-c{ text-align: center; }
/*color*/
.c-gray{ color: #9ea7b4;}
/*font*/
.fs-12{ font-size: 12px; }
.fs-14{ font-size: 14px; }
.c-c9{ color: #c6c6c6; }
/*flex*/
.flex{ display: flex;}
.flex-j-c{ justify-content: center; }
/*scroll*/
::-webkit-scrollbar{ width: 8px;}
::-webkit-scrollbar-track{ border-radius: 4px; background-color: rgba(0,0,0,.2)}
::-webkit-scrollbar-thumb{ border-radius: 4px; background: rgba(0,0,0,.4)}
</style>
