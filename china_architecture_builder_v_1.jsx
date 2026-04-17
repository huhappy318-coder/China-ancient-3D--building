export default function ChinaArchitectureBuilderV1() {
  const categories = [
    {
      title: "构件库",
      subtitle: "选择古建筑元素加入场景",
      items: ["庑殿顶", "歇山顶", "立柱", "横梁", "斗拱", "飞檐", "格扇门", "石阶"],
    },
    {
      title: "图纸",
      subtitle: "按参考方案逐步搭建",
      items: ["中轴线图", "平面图", "立面图", "屋顶结构图", "斗拱分层图"],
    },
    {
      title: "天气",
      subtitle: "切换场景氛围",
      items: ["晴光", "雨雾", "雪景", "黄昏", "夜色"],
    },
    {
      title: "光影",
      subtitle: "改变建筑展示效果",
      items: ["晨光", "午照", "夕照", "夜灯", "柔光"],
    },
    {
      title: "属性",
      subtitle: "调整当前选中构件",
      items: ["旋转", "缩放", "高度", "复制", "隐藏", "删除"],
    },
  ];

  const quickStats = [
    { label: "结构完整度", value: "76%" },
    { label: "美观评分", value: "A" },
    { label: "匠心值", value: "+148" },
  ];

  const blueprintSteps = [
    "先放置台基，确定中轴与进深。",
    "补齐立柱与横梁，形成主要骨架。",
    "加入斗拱与承托构件，稳定层次。",
    "选择屋顶样式并完成檐口覆盖。",
    "最后补充门窗、石阶和装饰细节。",
  ];

  const sideNav = [
    { key: "components", label: "构件", icon: "构" },
    { key: "blueprint", label: "图纸", icon: "图" },
    { key: "weather", label: "天气", icon: "天" },
    { key: "light", label: "光影", icon: "光" },
    { key: "settings", label: "属性", icon: "设" },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.12),transparent_28%),linear-gradient(180deg,#2a211b_0%,#171412_52%,#100d0b_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[28rem] w-[28rem] rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative flex min-h-screen">
          <aside className="flex w-[88px] shrink-0 flex-col items-center justify-between border-r border-white/10 bg-stone-950/70 px-3 py-4 backdrop-blur">
            <div className="flex w-full flex-col items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300 text-lg font-bold text-stone-900 shadow-lg shadow-amber-500/20">
                筑
              </div>
              {sideNav.map((item, idx) => (
                <button
                  key={item.key}
                  className={`flex w-full flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-xs transition ${
                    idx === 0
                      ? "border-amber-300/50 bg-amber-300/15 text-amber-100"
                      : "border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-sm">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="flex w-full flex-col gap-3">
              <button className="rounded-2xl border border-white/10 bg-white/5 px-2 py-3 text-xs text-stone-300 transition hover:bg-white/10">
                隐藏边框
              </button>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-2 py-3 text-center">
                <div className="text-[10px] tracking-[0.25em] text-emerald-200">灵感</div>
                <div className="mt-1 text-xs text-white">江南雨亭</div>
              </div>
            </div>
          </aside>

          <aside className="w-[320px] shrink-0 border-r border-white/10 bg-stone-950/55 p-4 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs tracking-[0.28em] text-amber-200">左侧弹出功能面板</div>
                <h2 className="mt-2 text-2xl font-semibold text-white">构件库</h2>
                <p className="mt-1 text-sm text-stone-400">用户点击左侧边框按钮后，从这里弹出对应功能内容。</p>
              </div>
              <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-stone-300 hover:bg-white/10">
                收起
              </button>
            </div>

            <div className="mb-4">
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-amber-300"
                placeholder="搜索构件：斗拱 / 飞檐 / 月洞门"
              />
            </div>

            <div className="space-y-4">
              {categories.map((group, idx) => (
                <div key={group.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-white">{group.title}</h3>
                      <p className="mt-1 text-sm text-stone-400">{group.subtitle}</p>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs ${idx === 0 ? 'bg-amber-300/15 text-amber-200' : 'bg-white/10 text-stone-300'}`}>
                      {idx === 0 ? '当前展开' : '可切换'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {group.items.map((item) => (
                      <button
                        key={item}
                        className="rounded-2xl border border-white/10 bg-stone-900/60 px-3 py-2 text-sm text-stone-200 transition hover:border-amber-300 hover:bg-amber-300/10 hover:text-white"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <main className="relative flex-1 overflow-hidden">
            <header className="absolute left-6 right-6 top-6 z-20 flex items-center justify-between rounded-[28px] border border-white/10 bg-stone-950/55 px-6 py-4 shadow-xl backdrop-blur">
              <div>
                <div className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-200/10 px-3 py-1 text-[11px] tracking-[0.3em] text-amber-200">
                  东方营造 · 网页版 V1
                </div>
                <h1 className="mt-3 text-3xl font-semibold tracking-wide">进入即搭建的中国古建筑页面</h1>
                <p className="mt-2 text-sm text-stone-300">
                  主界面默认就是搭建场景。所有功能都收在左侧边框里，点击才展开，用户也可以一键隐藏整个边框区域。
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-stone-200 transition hover:bg-white/10">
                  新建方案
                </button>
                <button className="rounded-2xl border border-amber-300/40 bg-amber-200/10 px-4 py-2 text-sm text-amber-100 transition hover:bg-amber-200/20">
                  保存布局
                </button>
                <button className="rounded-2xl bg-amber-300 px-4 py-2 text-sm font-medium text-stone-900 transition hover:opacity-90">
                  导出预览
                </button>
              </div>
            </header>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,224,163,0.18),transparent_22%),linear-gradient(180deg,#8d6b4f_0%,#4a392c_20%,#251e18_52%,#171310_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.22)_18%,rgba(0,0,0,0.58)_100%)]" />
            <div className="absolute left-[12%] top-[18%] h-28 w-28 rounded-full bg-amber-100/75 blur-2xl" />

            <div className="absolute left-1/2 top-[56%] h-[420px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-[48px] border border-amber-200/20 bg-gradient-to-b from-stone-900/25 to-stone-950/72 shadow-[0_40px_120px_rgba(0,0,0,0.58)] backdrop-blur-sm">
              <div className="absolute left-1/2 top-[22%] h-16 w-[640px] -translate-x-1/2 rounded-[999px] border border-amber-100/15 bg-gradient-to-b from-amber-100/10 to-transparent" />
              <div className="absolute left-1/2 top-[30%] h-16 w-[560px] -translate-x-1/2 rounded-[999px] bg-gradient-to-r from-amber-100/10 via-amber-200/28 to-amber-100/10" />
              <div className="absolute left-1/2 top-[42%] h-32 w-[560px] -translate-x-1/2 rounded-[34px] border border-amber-100/15 bg-amber-100/5" />
              <div className="absolute left-1/2 top-[55%] flex -translate-x-1/2 gap-10">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="h-40 w-5 rounded-full bg-gradient-to-b from-amber-100/80 to-amber-400/40 shadow-[0_0_20px_rgba(252,211,77,0.14)]" />
                ))}
              </div>

              <div className="absolute inset-x-0 bottom-8 mx-auto flex w-[86%] items-center justify-between rounded-[28px] border border-white/10 bg-stone-950/65 px-5 py-4 backdrop-blur">
                <div>
                  <div className="text-[11px] tracking-[0.25em] text-amber-200">主搭建场景</div>
                  <div className="mt-2 text-2xl font-semibold text-white">古建筑实时搭建页</div>
                  <div className="mt-1 text-sm text-stone-300">中间区域完整留给搭建视图，后续可直接接入 Three.js / React Three Fiber。</div>
                </div>
                <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                  状态：沉浸搭建中
                </div>
              </div>
            </div>

            <div className="absolute left-6 top-36 z-10 flex flex-wrap gap-3">
              {quickStats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-stone-950/55 px-4 py-3 backdrop-blur">
                  <div className="text-xs text-stone-400">{item.label}</div>
                  <div className="mt-1 text-lg font-semibold text-white">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3">
              {['俯视', '透视', '图纸叠加', '自由漫游'].map((view, idx) => (
                <button
                  key={view}
                  className={`rounded-2xl px-4 py-3 text-sm transition ${
                    idx === 1
                      ? 'bg-amber-300 text-stone-900 shadow-lg shadow-amber-500/20'
                      : 'border border-white/10 bg-stone-950/55 text-stone-200 backdrop-blur hover:bg-white/10'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>

            <div className="absolute bottom-6 right-6 z-10 w-[340px] rounded-[28px] border border-white/10 bg-stone-950/60 p-4 backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">搭建步骤</h2>
                  <p className="text-sm text-stone-400">也可以作为左侧点击后的弹出内容</p>
                </div>
                <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-stone-300 hover:bg-white/10">
                  隐藏
                </button>
              </div>

              <div className="space-y-2">
                {blueprintSteps.map((step, idx) => (
                  <div key={step} className="flex gap-2 rounded-2xl bg-white/5 px-3 py-3 text-sm text-stone-200">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-300 text-[11px] font-semibold text-stone-900">
                      {idx + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
