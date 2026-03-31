# qcc-agent-cli

> 企查查智能体数据平台命令行工具 —— 为人类和 AI Agent 而生的企业数据查询利器

[![npm version](https://img.shields.io/npm/v/qcc-agent-cli.svg)](https://www.npmjs.com/package/qcc-agent-cli)
[![npm download](https://img.shields.io/npm/dm/qcc-agent-cli.svg)](https://www.npmjs.com/package/qcc-agent-cli)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

-----

## 📖 项目简介

`qcc-agent-cli` 是企查查官方推出的命令行工具，旨在帮助开发者和 AI Agent 快速访问企业工商信息、知识产权、经营风险等全维度商业数据。

**核心能力**：
- 🎯 **4 大数据域**：企业基础信息、知识产权、经营信息、风险信息
- 🔧 **65 个查询工具**：覆盖工商、专利、商标、招投标、司法诉讼等场景
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

- **简洁命令**：`qcc company get_company_registration_info --searchKey "企业名称"`
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

| 服务标识 | 服务名称 | 工具数 | 典型场景 |
| :---: | :---: | :---: | :--- |
| `company` | 企业基础信息 | 12 | 工商详情、股东、主要人员、投资关系等 |
| `ipr` | 知识产权 | 6 | 专利、商标、著作权查询等 |
| `operation` | 经营信息 | 13 | 招投标、招聘记录、行政许可等 |
| `risk` | 风险信息 | 34 | 司法诉讼、经营异常、行政处罚等 |

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

| 命令 | 描述 | 示例                                                      |
| :--- | :--- |:--------------------------------------------------------|
| `init` | 初始化全局配置 | `qcc init --mcpBaseUrl <url> --authorization "<token>"` |
| `check` | 检查当前配置有效性及环境状态 | `qcc check`                                             |
| `update` | 强制同步远程工具定义到本地缓存 | `qcc update`                                            |
| `list-tools` | 列出当前支持的所有查询工具 | `qcc list-tools <server>`                               |

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

### 1️⃣ company - 企业基础信息（12 个工具）

| 工具名称 | 描述 | 调用示例 |
| :--- | :--- | :--- |
| `get_company_registration_info` | 核心工商登记信息（法人、注册资本、成立时间等） | `qcc company get_company_registration_info --searchKey "企业名称"` |
| `get_shareholder_info` | 股东构成、持股比例、认缴出资额 | `qcc company get_shareholder_info --searchKey "企业名称"` |
| `get_key_personnel` | 主要管理人员、高管职务 | `qcc company get_key_personnel --searchKey "企业名称"` |
| `get_annual_reports` | 年度报告、统一社会信用代码、从业人数、股东转股 | `qcc company get_annual_reports --searchKey "企业名称"` |
| `get_change_records` | 历史变更记录（变更事项、前后内容、日期） | `qcc company get_change_records --searchKey "企业名称"` |
| `get_branches` | 分支机构信息（名称、负责人、地区、成立日期） | `qcc company get_branches --searchKey "企业名称"` |
| `get_external_investments` | 对外投资信息（被投资方、持股比例、认缴金额） | `qcc company get_external_investments --searchKey "企业名称"` |
| `get_contact_info` | 联系方式（电话、邮箱、官网、ICP 备案） | `qcc company get_contact_info --searchKey "企业名称"` |
| `get_company_profile` | 企业简介信息 | `qcc company get_company_profile --searchKey "企业名称"` |
| `get_listing_info` | 上市信息（股票代码、市值、总股本、发行日期） | `qcc company get_listing_info --searchKey "企业名称"` |
| `get_tax_invoice_info` | 税号开票信息（纳税人识别号、开户行等） | `qcc company get_tax_invoice_info --searchKey "企业名称"` |
| `verify_company_accuracy` | 核实企业名称、法人与统一代码匹配性 | `qcc company verify_company_accuracy --searchKey "统一代码" --name "企业名称"` |

---

### 2️⃣ ipr - 企业知识产权（6 个工具）

| 工具名称 | 描述 | 调用示例 |
| :--- | :--- | :--- |
| `get_patent_info` | 专利信息（技术创新、核心技术储备） | `qcc ipr get_patent_info --searchKey "企业名称"` |
| `get_trademark_info` | 商标注册信息（品牌资产、知识产权布局） | `qcc ipr get_trademark_info --searchKey "企业名称"` |
| `get_software_copyright_info` | 软件著作权（软件名称、登记号、版本号） | `qcc ipr get_software_copyright_info --searchKey "企业名称"` |
| `get_copyright_work_info` | 作品著作权信息（文创资产、版权保护） | `qcc ipr get_copyright_work_info --searchKey "企业名称"` |
| `get_internet_service_info` | ICP 备案、APP 备案、小程序备案、算法备案 | `qcc ipr get_internet_service_info --searchKey "企业名称"` |
| `get_standard_info` | 参与制定的各类标准（行业影响力评估） | `qcc ipr get_standard_info --searchKey "企业名称"` |

---

### 3️⃣ operation - 企业经营信息（13 个工具）

| 工具名称 | 描述 | 调用示例 |
| :--- | :--- | :--- |
| `get_bidding_info` | 招投标项目（中标情况、项目金额、招标单位） | `qcc operation get_bidding_info --searchKey "企业名称"` |
| `get_recruitment_info` | 招聘信息（职位、月薪、学历、办公地点） | `qcc operation get_recruitment_info --searchKey "企业名称"` |
| `get_administrative_license` | 行政许可信息（经营资质核查） | `qcc operation get_administrative_license --searchKey "企业名称"` |
| `get_company_announcement` | 企业公告（上市企业重大动态披露） | `qcc operation get_company_announcement --searchKey "企业名称"` |
| `get_credit_evaluation` | 官方信用评级（纳税信用、海关信用） | `qcc operation get_credit_evaluation --searchKey "企业名称"` |
| `get_financing_records` | 融资历史（创投融资、上市融资、增发） | `qcc operation get_financing_records --searchKey "企业名称"` |
| `get_honor_info` | 荣誉信息（名称、级别、认证年份） | `qcc operation get_honor_info --searchKey "企业名称"` |
| `get_import_export_credit` | 进出口信用信息（信用等级、备案日期） | `qcc operation get_import_export_credit --searchKey "企业名称"` |
| `get_news_sentiment` | 新闻报道和舆情信息（声誉监控、危机预警） | `qcc operation get_news_sentiment --searchKey "企业名称"` |
| `get_qualifications` | 资质证书（类型、等级、有效期、发证机构） | `qcc operation get_qualifications --searchKey "企业名称"` |
| `get_ranking_list_info` | 各类榜单（榜单名称、排名、来源） | `qcc operation get_ranking_list_info --searchKey "企业名称"` |
| `get_spot_check_info` | 抽查检查记录（结果、检查机关） | `qcc operation get_spot_check_info --searchKey "企业名称"` |
| `get_telecom_license` | 电信业务经营许可（许可证号、业务种类） | `qcc operation get_telecom_license --searchKey "企业名称"` |

---

### 4️⃣ risk - 企业风险信息（34 个工具）

| 工具名称 | 描述 | 调用示例 |
| :--- | :--- | :--- |
| `get_administrative_penalty` | 行政处罚记录（处罚金额、机关） | `qcc risk get_administrative_penalty --searchKey "企业名称"` |
| `get_business_exception` | 经营异常名录（列入日期、移出原因） | `qcc risk get_business_exception --searchKey "企业名称"` |
| `get_dishonest_info` | 失信被执行人（涉案金额、执行法院） | `qcc risk get_dishonest_info --searchKey "企业名称"` |
| `get_high_consumption_restriction` | 限制高消费（涉案金额、申请人） | `qcc risk get_high_consumption_restriction --searchKey "企业名称"` |
| `get_judgment_debtor_info` | 被执行人信息（执行标的、立案时间） | `qcc risk get_judgment_debtor_info --searchKey "企业名称"` |
| `get_case_filing_info` | 立案信息（案号、案由、原被告） | `qcc risk get_case_filing_info --searchKey "企业名称"` |
| `get_hearing_notice` | 开庭公告（庭审时间、当事人） | `qcc risk get_hearing_notice --searchKey "企业名称"` |
| `get_judicial_documents` | 判决文书（裁判结果、涉案金额） | `qcc risk get_judicial_documents --searchKey "企业名称"` |
| `get_equity_pledge_info` | 股权出质（出质人、质权人、数额） | `qcc risk get_equity_pledge_info --searchKey "企业名称"` |
| `get_equity_freeze` | 股权冻结（冻结数额、期限、法院） | `qcc risk get_equity_freeze --searchKey "企业名称"` |
| `get_chattel_mortgage_info` | 动产抵押（登记编号、抵押权人、金额） | `qcc risk get_chattel_mortgage_info --searchKey "企业名称"` |
| `get_land_mortgage_info` | 土地抵押（坐落、面积、用途） | `qcc risk get_land_mortgage_info --searchKey "企业名称"` |
| `get_guarantee_info` | 担保信息（担保方、金额、履行状态） | `qcc risk get_guarantee_info --searchKey "企业名称"` |
| `get_stock_pledge_info` | 股权质押（质押股份数、市值） | `qcc risk get_stock_pledge_info --searchKey "企业名称"` |
| `get_court_notice` | 法院公告（公告类型、原被告） | `qcc risk get_court_notice --searchKey "企业名称"` |
| `get_cancellation_record_info` | 注销备案（注销原因、日期） | `qcc risk get_cancellation_record_info --searchKey "企业名称"` |
| `get_liquidation_info` | 清算信息（清算组负责人、成员） | `qcc risk get_liquidation_info --searchKey "企业名称"` |
| `get_simple_cancellation_info` | 简易注销（公告期、注销结果） | `qcc risk get_simple_cancellation_info --searchKey "企业名称"` |
| `get_bankruptcy_reorganization` | 破产重整（案号、申请人、日期） | `qcc risk get_bankruptcy_reorganization --searchKey "企业名称"` |
| `get_disciplinary_list` | 惩戒名单（类型、领域、列入原因） | `qcc risk get_disciplinary_list --searchKey "企业名称"` |
| `get_serious_violation` | 严重违法失信名单 | `qcc risk get_serious_violation --searchKey "企业名称"` |
| `get_tax_abnormal` | 税务非正常户记录 | `qcc risk get_tax_abnormal --searchKey "企业名称"` |
| `get_tax_arrears_notice` | 欠税情况（税种、余额） | `qcc risk get_tax_arrears_notice --searchKey "企业名称"` |
| `get_tax_violation` | 税收违法信息（违法事实、税务机关） | `qcc risk get_tax_violation --searchKey "企业名称"` |
| `get_environmental_penalty` | 环保处罚（决定书文号、金额） | `qcc risk get_environmental_penalty --searchKey "企业名称"` |
| `get_judicial_auction` | 司法拍卖（起拍价、评估价、时间） | `qcc risk get_judicial_auction --searchKey "企业名称"` |
| `get_exit_restriction` | 限制出境（相关人员、法院） | `qcc risk get_exit_restriction --searchKey "企业名称"` |
| `get_public_exhortation` | 公示催告（票据号、申请人、金额） | `qcc risk get_public_exhortation --searchKey "企业名称"` |
| `get_service_announcement` | 劳动仲裁开庭公告、送达公告 | `qcc risk get_service_announcement --searchKey "企业名称"` |
| `get_service_notice` | 送达公告（案号、当事人、法院） | `qcc risk get_service_notice --searchKey "企业名称"` |
| `get_pre_litigation_mediation` | 诉前调解记录（案号、法院） | `qcc risk get_pre_litigation_mediation --searchKey "企业名称"` |
| `get_terminated_cases` | 终结本次执行（日期、未履行金额） | `qcc risk get_terminated_cases --searchKey "企业名称"` |
| `get_valuation_inquiry` | 资产询价评估（标的物、参考价） | `qcc risk get_valuation_inquiry --searchKey "企业名称"` |
| `get_default_info` | 债券/票据违约（违约状态、本金、利息） | `qcc risk get_default_info --searchKey "企业名称"` |

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
