# TIRT Ocean Quiz

一个基于 Thurstonian IRT 思路的大五人格迫选法自适应测评系统，采用 20 题块 / 80 选项结构，并通过 Astro 构建为纯静态前端。

系统目标是提供干净、克制、学术感强的测评体验：题目和选项会在每次会话中随机化，作答后实时更新估计，并生成媲美顶级商业心理测评质感的结果报告。

## 核心特性

- 20 个迫选题块，每题 4 个陈述
- Best / Worst 作答格式
- 每次会话随机打散题块和选项顺序
- 根据当前不确定度和维度覆盖度自适应选择下一题
- 前端基于块内成对偏好进行 MAP 风格估计
- 亮色 / 暗色模式切换
- 多语言支持（已集成英语、中文、西班牙语、法语、日语、俄语、韩语、葡萄牙语、印地语、德语、意大利语、乌克兰语、阿拉伯语、土耳其语、荷兰语、波兰语、越南语、泰语、印尼语、瑞典语 20 种语言，文案由 Gemini 翻译）
- 支持 GitHub Pages 静态部署

## 数据与校准

离线管道使用 OpenPsychometrics IPIP 大五人格开放响应数据集作为参数校准来源，官方标注 `n=1,015,342`。

线上测评使用原创迫选陈述。公开数据用于离线参数估计和验证支持，前端运行时不需要后端服务器或数据库。

原始 CSV 体积较大，保留在本地 `raw_data/` 中，不进入 GitHub。仓库只保留前端运行需要的轻量题库与参数 JSON。

## 技术栈

- Astro
- Tailwind CSS
- TypeScript
- pnpm
- Python 数据管道：pandas、NumPy、SciPy

## 本地开发

在线地址：

```text
https://billzi2016.github.io/tirt-ocean-quiz/
```

```bash
pnpm install
pnpm dev
```

打开：

```text
http://127.0.0.1:4321/tirt-ocean-quiz/zh/quiz/
```

如果默认端口被占用，Astro 会自动使用其他本地端口。

## 构建

```bash
pnpm build
```

## 离线数据管道

下载并解压 OpenPsychometrics 数据集：

```bash
python3 pipeline/01_fetch_data.py
```

从响应数据估计简化 item 参数：

```bash
python3 pipeline/02_fit_irt.py
```

把校准参数导出到前端题库：

```bash
python3 pipeline/03_export_blocks.py
```

大体积原始数据文件已被 Git 忽略，应保留在 `raw_data/` 下。

## 项目结构

```text
pipeline/             离线数据与参数管道
public/data/          前端读取的静态题库
src/components/       Astro UI 组件
src/i18n/             语言注册表与 UI 文案字典
src/lib/              自适应选题、估分、状态与运行时逻辑
src/pages/            Astro 页面路由
src/styles/           Tailwind 入口与全局样式
```

## 多语言

已支持 20 种语言（题库及 UI 文案由 Gemini 翻译）：

- 英语（`en`）：`/tirt-ocean-quiz/quiz/`
- 中文（`zh`）：`/tirt-ocean-quiz/zh/quiz/`
- 西班牙语（`es`）：`/tirt-ocean-quiz/es/quiz/`
- 法语（`fr`）：`/tirt-ocean-quiz/fr/quiz/`
- 日语（`ja`）：`/tirt-ocean-quiz/ja/quiz/`
- 俄语（`ru`）：`/tirt-ocean-quiz/ru/quiz/`
- 韩语（`ko`）：`/tirt-ocean-quiz/ko/quiz/`
- 葡萄牙语（`pt`）：`/tirt-ocean-quiz/pt/quiz/`
- 印地语（`hi`）：`/tirt-ocean-quiz/hi/quiz/`
- 德语（`de`）：`/tirt-ocean-quiz/de/quiz/`
- 意大利语（`it`）：`/tirt-ocean-quiz/it/quiz/`
- 乌克兰语（`uk`）：`/tirt-ocean-quiz/uk/quiz/`
- 阿拉伯语（`ar`）：`/tirt-ocean-quiz/ar/quiz/`
- 土耳其语（`tr`）：`/tirt-ocean-quiz/tr/quiz/`
- 荷兰语（`nl`）：`/tirt-ocean-quiz/nl/quiz/`
- 波兰语（`pl`）：`/tirt-ocean-quiz/pl/quiz/`
- 越南语（`vi`）：`/tirt-ocean-quiz/vi/quiz/`
- 泰语（`th`）：`/tirt-ocean-quiz/th/quiz/`
- 印尼语（`id`）：`/tirt-ocean-quiz/id/quiz/`
- 瑞典语（`sv`）：`/tirt-ocean-quiz/sv/quiz/`

多语言层采用注册表设计，可方便扩展其他语言。

## 免责声明

1. **AI 自动翻译**：本项目的多语言题库、UI 界面文案、维度解释及测评报告均由 Gemini AI 自动翻译与本地化。翻译已尽可能保留原始心理计量学语意，但不同语言的表达细节可能存在微小差异。
2. **仅供自我探索与科研展示**：本测评系统仅用于个人自我了解、学术研究展示及技术体验。
3. **不构成临床诊断**：本测评非临床心理评估工具、医疗诊断设备或职业筛选结论，不提供任何医学、精神病学或心理健康诊疗建议。
4. **专业咨询提示**：如需专业心理评估或心理健康帮助，请咨询具备资质的专业医疗人员或心理咨询师。

## 方法参考

- Brown, A., & Maydeu-Olivares, A. (2011). *Item Response Modeling of Forced-Choice Questionnaires*. Educational and Psychological Measurement, 71(3), 460-502. https://doi.org/10.1177/0013164410375112
- Frick, S. (2023). *Estimating and Using Block Information in the Thurstonian IRT Model*. Psychometrika, 88, 1262-1284. https://doi.org/10.1007/s11336-023-09931-8
- van der Linden, W. J., & Glas, C. A. W. (Eds.). (2010). *Elements of Adaptive Testing*. Springer. https://doi.org/10.1007/978-0-387-85461-8

## License

MIT License.
