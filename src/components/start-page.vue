<template>
  <div class="start-page row justify-content-center">
    <div class="d-none d-md-flex col-md-6 col-lg-7">
      <div class="d-flex h-75 justify-content-center align-items-center">
        <div class="w-75 p-4" style="background-color: #37393787;color:white;">
          <h5>使用建议</h5>
          <ol>
            <li>建议用户使用Chrome、360、搜狗等浏览器访问本系统，不建议使用IE或Edge浏览器；</li>
            <li>建议使用PC访问本系统，不建议使用平板、手机等小屏设备；</li>
            <li>当页面显示不正常时，尝试更改系统分辨率或浏览器页面缩放比例以解决问题；</li>
            <li>若有无法解决的问题，请及时联系管理员。</li>
          </ol>
        </div>
      </div>
    </div>
    <div class="col-12 col-sm-9 col-md-6 col-lg-5">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {};
</script>