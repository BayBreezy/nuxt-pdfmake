<template>
  <div
    class="pointer-events-none absolute h-full w-full overflow-hidden [perspective:500px] dark:opacity-70"
  >
    <div class="absolute inset-0 [transform:rotateX(20deg)]">
      <div
        class="animate-grid inset-0 -ml-[50%] bg-repeat [background-image:linear-gradient(to_right,theme(colors.input)_1px,transparent_0),linear-gradient(to_bottom,theme(colors.input)_1px,transparent_0)] [background-size:120px_120px] [height:700vh] [transform-origin:100%_0_0] [width:600vw]"
      />
    </div>

    <div class="from-background absolute inset-0 bg-gradient-to-t to-transparent to-90%" />
  </div>
</template>
