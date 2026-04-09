# qcc-agent-cli

> 企查查智能体数据平台命令行工具 —— 为人类和 AI Agent 而生的企业数据查询利器

[![npm version](https://img.shields.io/npm/v/qcc-agent-cli.svg)](https://www.npmjs.com/package/qcc-agent-cli)
[![npm download](https://img.shields.io/npm/dm/qcc-agent-cli.svg)](https://www.npmjs.com/package/qcc-agent-cli)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

-----

## 📖 项目简介

`qcc-agent-cli` 是企查查官方推出的命令行工具，旨在帮助开发者和 AI Agent 快速访问企业工商信息、知识产权、经营风险等全维度商业数据。

**核心能力**：
- 🎯 **4 大数据域**：企业信息、知识产权、经营信息、风险信息
- 🔧 **67 个查询工具**：覆盖工商、专利、商标、招投标、司法诉讼等场景
- 🤖 **AI Agent 友好**：Markdown 格式化输出、Schema 自省、参数自动验证
- 🔒 **安全可控**：配置隔离、敏感信息脱敏

-----

## 🌟 为什么选择 qcc-agent-cli？

### 🤖 为 AI Agent 原生设计

- **Markdown 格式化输出**：默认输出易读的 Markdown 格式，支持 `--json` 输出原始 JSON
- **参数自描述**：每个工具的 inputSchema 完整描述参数类型和用途
- **Schema 自省**：支持 `qcc list-tools` 动态获取工具定义，Agent 可自主发现能力
- **确定性输出**：无歧义的错误码和状态码，便于 Agent 决策

### 👤 为人类开发者设计

- **简洁命令**：`qcc company get_company_registration_info "企业名称"`
- **友好输出**：默认 Markdown 格式化展示，支持 `--json` 输出原始数据
- **智能提示**：内置 `--help` 和参数验证，快速上手
- **配置检查**：`qcc check` 一键诊断配置状态

### 🏢 为企业级应用设计

- **配置驱动**：统一配置文件 `~/.qcc/config.json`，支持多环境切换
- **工具缓存**：本地缓存工具定义，减少网络请求，提升响应速度
- **错误处理**：统一的错误类型和友好的错误提示

### 🚀 零门槛上手

- **3 分钟安装**：`npm install -g qcc-agent-cli`
- **一行命令查询**：无需编写代码，命令行直达数据
- **MIT 开源协议**：可自由定制和扩展

### 🛡️ 安全可控

- **凭证隔离**：配置文件权限自动设置为 600，仅所有者可读写
- **敏感信息脱敏**：日志和输出中自动隐藏密钥和 Token

-----

## ⚡ 功能特性

### 核心服务矩阵

| 服务标识 | 服务名称 | 典型场景 |
| :---: | :---: | :--- |
| `company` | 企业信息 | 多维度企业画像洞察，核验企业资质，评估发展轨迹，为商业决策提供数据支撑。 |
| `ipr` | 知识产权 | 知识产权布局分析，拆解品牌技术实力，为市场决策提供专业支持。 |
| `operation` | 经营信息 | 企业经营动态监测，还原企业经营现状，为合作决策提供商业情报。 |
| `risk` | 风险信息 | 企业风险深度扫描，识别合规信用隐患，精准评估合作风险。 |

-----

## 🚀 快速开始

### 1\. 环境准备

| 依赖 | 要求 |
| :--- | :--- |
| **Node.js** | >= 18.0 |
| **npm** | >= 9.0 |

### 2\. 安装工具

使用 npm 全局安装：

```bash
npm install -g qcc-agent-cli
```

如已安装，可通过以下命令更新到最新版本：

```bash
npm update -g qcc-agent-cli
```

安装完成后，验证版本：

```bash
qcc --version
```

### 3\. 初始化配置

在使用之前，需要配置您的 MCP 服务地址和鉴权信息：

```bash
qcc init --authorization "Bearer YOUR_API_KEY"
```

### 4\. 开启查询

查询企业工商注册信息：

```bash
qcc company get_company_registration_info "企查查科技股份有限公司"
```

-----

## 📖 命令手册

### 基础管理命令

| 命令 | 描述 | 示例                                                     |
| :--- | :--- |:-------------------------------------------------------|
| `init` | 初始化全局配置 | `qcc init --authorization "Bearer YOUR_API_KEY"`       |
| `check` | 检查当前配置有效性及环境状态 | `qcc check`                                            |
| `update` | 强制同步远程工具定义到本地缓存 | `qcc update`                                           |
| `list-tools` | 列出当前支持的所有查询工具 | `qcc list-tools <server>`                              |

### 数据查询调用

```bash
qcc <server> <tool> --<paramKey> "<paramValue>"
```

-----

## 📚 查询指令手册

### 调用格式

```bash
qcc <server> <tool> --<paramKey> "<paramValue>"
```

**参数说明**：
- `server`：服务标识（`company` / `ipr` / `operation` / `risk`）
- `tool`：工具名称
- `--paramKey`：参数键（如 `--searchKey`）
- `paramValue`：企业名称或统一社会信用代码

**通用参数**：
- `--json`：输出原始 JSON 格式（默认输出 Markdown 格式化结果）

---

### 1️⃣ company - 企业信息

| 中文名 | 工具名称 | 描述 | 调用示例 |
| :--- | :--- | :--- | :--- |
| 企业工商信息 | `get_company_registration_info` | 查询企业的核心登记信息，当用户需要验证企业身份、了解基本概况（如法定代表人、注册资本、成立时间等）时调用。可提供企业名称、统一社会信用代码、法定代表人、注册资本、成立日期、登记状态、注册地址等关键工商登记信息，支持通过企业名称或统一社会信用代码精确查询。适用于深入了解企业工商背景的场景。 | `qcc company get_company_registration_info --searchKey "企业名称"` |
| 股东信息 | `get_shareholder_info` | 用于查询企业股东构成信息，包括投资人姓名、持股比例、认缴出资额、出资时间等股权结构情况。适用于企业股权结构分析、实际控制人识别、股东背景调查等场景。 | `qcc company get_shareholder_info --searchKey "企业名称"` |
| 主要人员 | `get_key_personnel` | 用于查询企业主要管理人员信息，包括姓名、职务等高管构成情况。适用于企业管理团队了解、核心人员识别、公司治理结构分析等场景。 | `qcc company get_key_personnel --searchKey "企业名称"` |
| 对外投资 | `get_external_investments` | 查询企业对外投资信息，包括被投资企业名称、状态、成立日期、持股比例、认缴出资额/持股数。适用于分析企业投资布局的场景。 | `qcc company get_external_investments --searchKey "企业名称"` |
| 变更记录 | `get_change_records` | 用于查询企业的历史变更记录，包括变更事项、变更前后内容、变更日期等企业发展变化信息。适用于企业股权变更跟踪、经营范围调整了解、重要事项变更历史查询等场景。 | `qcc company get_change_records --searchKey "企业名称"` |
| 分支机构 | `get_branches` | 查询企业的分支机构信息，包括分支机构名称、负责人、地区、成立日期、登记状态。适用于了解企业组织架构的场景。 | `qcc company get_branches --searchKey "企业名称"` |
| 企业年报 | `get_annual_reports` | 查询企业年度报告信息，包括报告年度、统一社会信用代码、注册号、企业经营状态、从业人数、股东股权转让情况、投资信息等。 | `qcc company get_annual_reports --searchKey "企业名称"` |
| 联系方式 | `get_contact_info` | 查询企业的联系方式信息，包括电话号码、用途标签、邮箱、企业网站、是否是官网、ICP备案。适用于拓客、获取企业联系方式的场景。 | `qcc company get_contact_info --searchKey "企业名称"` |
| 企业简介 | `get_company_profile` | 查询企业的简介信息，包括企业名称、简介。适用于企业画像构建、企业业务分析场景。 | `qcc company get_company_profile --searchKey "企业名称"` |
| 税号开票信息 | `get_tax_invoice_info` | 查询企业的税号开票信息，包括纳税人识别号、企业名称、企业类型、地址、联系电话、开户行、开户行账号。适用于财务开票场景。 | `qcc company get_tax_invoice_info --searchKey "企业名称"` |
| 上市信息 | `get_listing_info` | 查询企业的上市信息，包括上市日期、股票简称、股票代码、上市交易所、总市值、总股本、发行日期、发行量。适用于投资分析场景。 | `qcc company get_listing_info --searchKey "企业名称"` |
| 企业准确性验证 | `verify_company_accuracy` | 用于核实企业名称、法定代表人与统一社会信用代码的匹配性。适用于企业实名认证、准入资质初审及基础信息准确性校验场景。 | `qcc company verify_company_accuracy --searchKey "统一代码" --name "企业名称"` |
| 受益所有人 | `get_beneficial_owners` | 查询企业的受益所有人信息，适用于反洗钱合规（AML）、尽职调查及穿透式监管分析场景。 | `qcc company get_beneficial_owners --searchKey "企业名称"` |
| 实际控制人 | `get_actual_controller` | 查询企业的实际控制人详情，适用于企业风险评估、关联交易识别及商业竞争分析场景。 | `qcc company get_actual_controller --searchKey "企业名称"` |

---

### 2️⃣ ipr - 知识产权

| 中文名 | 工具名称 | 描述 | 调用示例 |
| :--- | :--- | :--- | :--- |
| 商标 | `get_trademark_info` | 查询企业商标注册信息。适用于企业品牌资产评估、知识产权布局分析及商标侵权风险核查场景。 | `qcc ipr get_trademark_info --searchKey "企业名称"` |
| 专利 | `get_patent_info` | 查询企业专利信息。适用于企业技术创新能力评估、核心技术储备分析及行业技术壁垒研究场景。 | `qcc ipr get_patent_info --searchKey "企业名称"` |
| 作品著作权 | `get_copyright_work_info` | 查询企业作品著作权信息。适用于文创资产价值评估、版权保护现状分析及内容产业背调场景。 | `qcc ipr get_copyright_work_info --searchKey "企业名称"` |
| 软件著作权 | `get_software_copyright_info` | 查询企业的软件著作权信息，包括软件名称、软件简称、登记号、版本号、登记日期、权利取得方式。适用于知识产权保护场景。 | `qcc ipr get_software_copyright_info --searchKey "企业名称"` |
| 网络服务备案 | `get_internet_service_info` | 查询企业的网站ICP备案、APP备案、小程序备案、算法备案信息，包括名称、备案号、许可证号、审核日期。适用于软件资产分析、网络服务分析场景。 | `qcc ipr get_internet_service_info --searchKey "企业名称"` |
| 标准信息 | `get_standard_info` | 查询企业参与制定的各类标准。适用于评估企业行业影响力、技术领先地位及标准化合规核查场景。 | `qcc ipr get_standard_info --searchKey "企业名称"` |

---

### 3️⃣ operation - 经营信息

| 中文名 | 工具名称 | 描述 | 调用示例 |
| :--- | :--- | :--- | :--- |
| 招投标信息 | `get_bidding_info` | 用于查询企业参与的招投标项目信息，包括项目名称、中标情况、项目金额、招标单位等市场活动信息。适用于企业业务拓展情况分析、市场份额评估、竞争对手中标情况了解等场景。 | `qcc operation get_bidding_info --searchKey "企业名称"` |
| 资质证书 | `get_qualifications` | 用于查询企业获得的各类资质证书信息，包括证书类型、等级、有效期、证书状态等资质情况时使用。适用于企业专业能力评估、行业准入资格确认、资质有效性检查等场景。 | `qcc operation get_qualifications --searchKey "企业名称"` |
| 信用评价 | `get_credit_evaluation` | 查询企业由政府监管机构出具的官方信用评级，包括国家税务总局的纳税信用等级及海关总署的海关信用等级（高级认证/一般认证等），含评价年度和评价单位。适用于企业税务合规性核查、海关资质评估、供应商信用背调及政府采购资格审查场景。 | `qcc operation get_credit_evaluation --searchKey "企业名称"` |
| 行政许可 | `get_administrative_license` | 查询企业行政许可信息。适用于企业合法经营资质核查、业务准入资格审查及合规性分析场景。 | `qcc operation get_administrative_license --searchKey "企业名称"` |
| 招聘信息 | `get_recruitment_info` | 查询企业招聘信息，包括发布日期、招聘职位、月薪、学历、经验、办公地点。适用于企业人才需求分析场景。 | `qcc operation get_recruitment_info --searchKey "企业名称"` |
| 新闻舆情 | `get_news_sentiment` | 用于查询企业相关的新闻报道和舆情信息，包括新闻标题、发布时间和情感倾向时使用。适用于企业声誉监控、品牌形象分析、危机公关预警、媒体关注度评估、企业重大事项跟踪场景。 | `qcc operation get_news_sentiment --searchKey "企业名称"` |
| 进出口信用 | `get_import_export_credit` | 查询企业进出口信用信息，包括统一社会信用代码、所在地海关、行政区划、地址、经济区划、经营类别、统计经济区划、行业种类、跨境贸易电子商务类型、信用等级、备案日期。适用于国际贸易合作评估场景。 | `qcc operation get_import_export_credit --searchKey "企业名称"` |
| 抽查检查 | `get_spot_check_info` | 查询企业抽查检查记录，包括检查实施机关、类型、日期、结果。适用于经营资质核查场景。 | `qcc operation get_spot_check_info --searchKey "企业名称"` |
| 电信许可 | `get_telecom_license` | 查询企业电信业务经营许可信息，包括许可证号、业务分类、业务种类、覆盖范围、是否有效。适用于企业合规性评估场景。 | `qcc operation get_telecom_license --searchKey "企业名称"` |
| 融资信息 | `get_financing_records` | 查询企业融资信息，包括创投融资、上市融资、增发融资。适用于追踪企业成长轨迹、投融资历史分析及市场认可度评估场景。 | `qcc operation get_financing_records --searchKey "企业名称"` |
| 上榜榜单 | `get_ranking_list_info` | 查询企业上榜的各类榜单信息，包括榜单名称、榜内排名、来源、榜单类型、榜内名称、发布日期。适用于资本运作分析场景。 | `qcc operation get_ranking_list_info --searchKey "企业名称"` |
| 荣誉信息 | `get_honor_info` | 查询企业获得的荣誉信息，包括名称、荣誉类型、级别、认证年份、发布日期、发布单位。适用于企业声誉评估场景。 | `qcc operation get_honor_info --searchKey "企业名称"` |
| 企业公告 | `get_company_announcement` | 查询企业发布的各类公告。适用于追踪上市企业重大动态、披露信息核查及企业信息透明度评估场景。 | `qcc operation get_company_announcement --searchKey "企业名称"` |

---

### 4️⃣ risk - 风险信息

| 中文名 | 工具名称 | 描述 | 调用示例 |
| :--- | :--- | :--- | :--- |
| 失信信息 | `get_dishonest_info` | 用于查询企业是否存在失信信息，包括失信被执行人名称、涉案金额、执行法院、立案日期、发布日期。适用于企业信用评估、法律风险分析、欠款违约情况调查等场景。 | `qcc risk get_dishonest_info --searchKey "企业名称"` |
| 被执行人 | `get_judgment_debtor_info` | 用于查询企业作为被执行人的案件信息，包括执行标的、立案时间、执行法院等执行程序信息。适用于企业债务执行情况了解、强制执行风险判断、执行金额规模评估等场景。 | `qcc risk get_judgment_debtor_info --searchKey "企业名称"` |
| 限制高消费 | `get_high_consumption_restriction` | 用于查询企业是否存在被法院限制高消费的情况，包括限制法定代表人、申请人、立案日期等执行信息。适用于信用风险评估、合作伙伴风险排查、法律风险预警等场景。 | `qcc risk get_high_consumption_restriction --searchKey "企业名称"` |
| 行政处罚 | `get_administrative_penalty` | 用于查询企业受到的行政处罚记录，包括处罚结果、处罚日期、处罚金额、处罚机关等监管处罚信息。适用于企业合规经营情况评估、违规成本分析、行政处罚历史查询等场景。 | `qcc risk get_administrative_penalty --searchKey "企业名称"` |
| 经营异常 | `get_business_exception` | 用于查询企业是否被列入经营异常名录，包括列入日期、移出原因和决定机关。适用于企业正常经营状态判断、轻微违规情况了解、企业信用修复跟踪等场景。 | `qcc risk get_business_exception --searchKey "企业名称"` |
| 严重违法 | `get_serious_violation` | 查询企业是否被列入严重违法失信名单。适用于企业准入严选、重大合规性审查及最高等级信用风险评估场景。 | `qcc risk get_serious_violation --searchKey "企业名称"` |
| 终本案件 | `get_terminated_cases` | 用于查询企业涉及的终结本次执行程序案件信息，包括终本日期、执行标的、未履行金额等执行终结情况。适用于企业执行风险了解、债务清偿能力评估、终本案件统计分析等场景。 | `qcc risk get_terminated_cases --searchKey "企业名称"` |
| 裁判文书 | `get_judicial_documents` | 用于查询企业涉及的法院判决文书，包括案件案由、裁判结果、涉案金额、当事人信息等司法判决信息。适用于企业法律纠纷历史分析、诉讼风险评估、判决结果查询等场景。 | `qcc risk get_judicial_documents --searchKey "企业名称"` |
| 立案信息 | `get_case_filing_info` | 用于查询企业涉及的法院立案信息，包括案号、案由、立案日期、原被告双方等案件基本信息。适用于企业诉讼情况初步了解、法律纠纷数量统计、案件类型分布分析等场景。 | `qcc risk get_case_filing_info --searchKey "企业名称"` |
| 开庭公告 | `get_hearing_notice` | 用于查询企业作为当事人的开庭公告信息，包括案号、案由、开庭时间、当事人身份等庭审排期信息。适用于企业诉讼动态跟踪、庭审时间安排查询、法律纠纷进展了解等场景。 | `qcc risk get_hearing_notice --searchKey "企业名称"` |
| 法院公告 | `get_court_notice` | 用于查询企业涉及的法院公告信息，包括公告类型、案由、原告被告信息、刊登日期等司法公告内容。适用于企业法律事务公告查询、诉讼当事人信息了解、司法程序进展跟踪等场景。 | `qcc risk get_court_notice --searchKey "企业名称"` |
| 送达公告 | `get_service_notice` | 查询企业相关送达公告，包括案号、案由、当事人、法院、发布日期。适用于法律文书送达情况场景。 | `qcc risk get_service_notice --searchKey "企业名称"` |
| 破产重整 | `get_bankruptcy_reorganization` | 用于查询企业破产重整相关信息，包括案号、申请人、被申请人、公开日期等破产程序信息。适用于企业破产风险识别、重整程序跟踪、债权人申请情况了解等场景。 | `qcc risk get_bankruptcy_reorganization --searchKey "企业名称"` |
| 股权冻结 | `get_equity_freeze` | 用于查询企业股权被司法冻结的情况，包括被冻结股权数额、冻结期限、执行法院等股权受限信息。适用于股东权益风险评估、股权变更限制了解、司法保全措施查询等场景。 | `qcc risk get_equity_freeze --searchKey "企业名称"` |
| 司法拍卖 | `get_judicial_auction` | 用于查询企业资产被司法拍卖的信息，包括拍卖标题、起拍价、评估价、拍卖时间、处置单位等资产处置情况。适用于企业资产被执行处置了解、司法变现情况跟踪、债权人受偿可能性评估等场景。适用于资产处置分析场景。 | `qcc risk get_judicial_auction --searchKey "企业名称"` |
| 询价评估 | `get_valuation_inquiry` | 查询企业资产询价评估信息，包括案号、标的物、所有人、当事人、询价结果、法院、发布日期。适用于资产评估场景。 | `qcc risk get_valuation_inquiry --searchKey "企业名称"` |
| 诉前调解 | `get_pre_litigation_mediation` | 查询企业诉前调解记录，包括案号、案由、当事人、法院、立案日期。适用于纠纷解决跟踪场景。 | `qcc risk get_pre_litigation_mediation --searchKey "企业名称"` |
| 限制出境 | `get_exit_restriction` | 查询企业相关人员被法院限制出境的情况。适用于高管个人风险排查、重大案件执行跟踪及司法强制措施预警场景。 | `qcc risk get_exit_restriction --searchKey "企业名称"` |
| 环保处罚 | `get_environmental_penalty` | 用于查询企业受到的环保行政处罚，包括处罚结果、处罚日期、处罚单位、处罚金额等环境违法信息。适用于企业环保合规情况评估、环境风险控制、绿色经营能力判断等场景。 | `qcc risk get_environmental_penalty --searchKey "企业名称"` |
| 税务非正常户 | `get_tax_abnormal` | 查询企业税务非正常户记录。适用于企业税务合规性扫描、税务黑名单核查及合作伙伴财务风险预警场景。 | `qcc risk get_tax_abnormal --searchKey "企业名称"` |
| 欠税公告 | `get_tax_arrears_notice` | 用于查询企业欠税情况，包括欠税税种、欠税余额、当前新发生的欠税金额、发布单位和发布日期等税务欠款信息。适用于企业纳税信用评估、税务风险判断、欠税情况跟踪等场景。 | `qcc risk get_tax_arrears_notice --searchKey "企业名称"` |
| 税收违法 | `get_tax_violation` | 用于查询企业税收违法信息，包括案件性质、所属税务机关、发布日期等税务违法情况。适用于企业纳税信用评估、税务合规风险识别、税收违法行为类型分析等场景。 | `qcc risk get_tax_violation --searchKey "企业名称"` |
| 惩戒名单 | `get_disciplinary_list` | 查询企业惩戒名单信息，包括类型、惩戒名单领域、列入原因、列入机关、列入日期。适用于信用评估场景。 | `qcc risk get_disciplinary_list --searchKey "企业名称"` |
| 违约事项 | `get_default_info` | 查询企业债券违约、票据违约、非标资产违约信息，包括债券简称、债券类型、违约状态、首次违约日期、累计违约本金、累计违约利息、到期日期。适用于债券投资风险分析场景。 | `qcc risk get_default_info --searchKey "企业名称"` |
| 担保信息 | `get_guarantee_info` | 查询企业担保信息，包括担保方、被担保方、担保方式、担保金额、履行状态、公告日期。适用于评估企业担保风险场景。 | `qcc risk get_guarantee_info --searchKey "企业名称"` |
| 股权出质 | `get_equity_pledge_info` | 用于查询企业股权出质情况，包括出质人、质权人、出质股权数额、登记日期、出质状态等股权融资信息。适用于企业融资状况分析、股权风险评估、股东资金需求判断等场景。 | `qcc risk get_equity_pledge_info --searchKey "企业名称"` |
| 股权质押 | `get_stock_pledge_info` | 查询企业股权质押信息，包括质押人、质押人参股企业、质押权人、质押股份总数、质押股份市值、状态、公告日期。适用于股票质押风险分析场景。 | `qcc risk get_stock_pledge_info --searchKey "企业名称"` |
| 动产抵押 | `get_chattel_mortgage_info` | 查询企业动产抵押信息，包括登记编号、抵押人、抵押权人、债务人履行债务的期限、被担保主债权数额、状态、登记日期。适用于动产融资评估场景。 | `qcc risk get_chattel_mortgage_info --searchKey "企业名称"` |
| 土地抵押 | `get_land_mortgage_info` | 查询企业土地抵押信息，包括土地坐落、抵押人、抵押权人、抵押起止日期、抵押面积、抵押金额、抵押土地用途。适用于土地资产抵押分析场景。 | `qcc risk get_land_mortgage_info --searchKey "企业名称"` |
| 简易注销 | `get_simple_cancellation_info` | 用于查询企业简易注销相关信息，包括公告期、注销结果、登记机关等简化注销程序情况。适用于企业注销程序了解、简易注销适用情况确认、市场主体退出机制跟踪等场景。 | `qcc risk get_simple_cancellation_info --searchKey "企业名称"` |
| 注销备案 | `get_cancellation_record_info` | 用于查询企业注销备案情况，包括注销原因、注销日期、公告状态等企业终止经营信息。适用于企业存续状态确认、注销程序了解、经营主体资格查询等场景。 | `qcc risk get_cancellation_record_info --searchKey "企业名称"` |
| 清算信息 | `get_liquidation_info` | 查询企业清算信息，包括清算组负责人、清算组成员。适用于企业破产或解散清算分析场景。 | `qcc risk get_liquidation_info --searchKey "企业名称"` |
| 劳动仲裁 | `get_service_announcement` | 查询企业涉及的劳动仲裁开庭公告和送达公告，包括仲裁案号、申请人、被申请人及公告发布日期。适用于企业劳动纠纷监控、劳动仲裁程序跟踪及用工风险排查场景。 | `qcc risk get_service_announcement --searchKey "企业名称"` |
| 公示催告 | `get_public_exhortation` | 查询企业公示催告信息，包括票据号、申请人、持票人、票面金额、票据类型、发布机关、公告日期。适用于票据遗失等法律程序查询场景。 | `qcc risk get_public_exhortation --searchKey "企业名称"` |

-----

## ⚙️ 配置说明

配置文件默认存储在 `~/.qcc/config.json`。

### 字段解析

* `mcp.baseUrl`: MCP API 服务的基础路径。
* `mcp.authorization`: 访问凭证，输出时会自动脱敏。
* `mcp.timeout`: 请求超时时间（毫秒）。
* `mcp.enabled`: 是否启用 MCP 模式（默认 `true`）。

### 配置命令

```bash
# 设置配置
qcc config set mcp.baseUrl https://agent.qcc.com/mcp
qcc config set mcp.authorization "Bearer YOUR_API_KEY"

# 获取配置
qcc config get mcp.baseUrl

# 列出所有配置
qcc config list
```

### 安全性提示

* **敏感信息遮蔽**：在执行 `config list` 或 `check` 时，`authorization` 将显示为 `[已配置]`。
* **权限保护**：配置文件目录由系统权限自动保护（权限 600），建议不要手动将其暴露在公共仓库中。

-----

## 🏗️ 目录结构

```text
qcc-cli/
├── bin/
│   └── index.js              # CLI 入口
├── src/
│   ├── cliSetup.js           # CLI 命令注册
│   ├── commands/             # 指令实现 (init, check, update, config...)
│   ├── services/             # 核心逻辑 (MCP 协议解析、配置持久化)
│   ├── utils/                # 工具类 (HTTP 客户端、验证器、格式化器)
│   └── config/               # 静态服务与工具定义
└── package.json
```

-----

## 📄 开源协议

本项目遵循 [MIT License](https://opensource.org/licenses/MIT) 开源协议。

-----

<div align="center">
<sub>Built with by QCC Team.</sub>
</div>
