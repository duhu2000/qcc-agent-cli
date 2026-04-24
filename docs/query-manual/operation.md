# operation - 经营信息

> 企业经营动态监测，还原企业经营现状，为合作决策提供商业情报。

当前服务共收录 **14** 个工具，适合用于 经营动态、资质许可、融资、舆情与市场活动分析。

## 调用方式

```bash
qcc operation <tool> --<paramKey> "<paramValue>"
```

通用参数：
- `--json`：输出原始 JSON。
- `qcc list-tools operation`：查看该服务最新工具定义。

## 工具清单

| 中文名 | 工具名称 | 说明 | 示例 |
| :--- | :--- | :--- | :--- |
| 招投标信息 | `get_bidding_info` | 用于查询企业参与的招投标项目信息，包括项目名称、中标情况、项目金额、招标单位等市场活动信息。适用于企业业务拓展情况分析、市场份额评估、竞争对手中标情况了解等场景。数据更新频率：T+0（聚合全国各级公共资源交易平台数据）。 | `qcc operation get_bidding_info --searchKey "企业名称"` |
| 资质证书 | `get_qualifications` | 用于查询企业获得的各类资质证书信息，包括证书类型、等级、有效期、证书状态等资质情况时使用。适用于企业专业能力评估、行业准入资格确认、资质有效性检查等场景。数据更新频率：T+1。 | `qcc operation get_qualifications --searchKey "企业名称"` |
| 信用评价 | `get_credit_evaluation` | 查询企业由政府监管机构出具的官方信用评级，包括国家税务总局的纳税信用等级及海关总署的海关信用等级（高级认证/一般认证等），含评价年度和评价单位。适用于企业税务合规性核查、海关资质评估、供应商信用背调及政府采购资格审查场景。数据更新频率：T+0。 | `qcc operation get_credit_evaluation --searchKey "企业名称"` |
| 行政许可 | `get_administrative_license` | 查询企业行政许可信息。适用于企业合法经营资质核查、业务准入资格审查及合规性分析场景。数据更新频率：T+0（各行政审批机关公示系统）。 | `qcc operation get_administrative_license --searchKey "企业名称"` |
| 招聘信息 | `get_recruitment_info` | 查询企业招聘信息，包括发布日期、招聘职位、月薪、学历、经验、办公地点。适用于企业人才需求分析场景。数据更新频率：T+0。 | `qcc operation get_recruitment_info --searchKey "企业名称"` |
| 新闻舆情 | `get_news_sentiment` | 用于查询企业相关的新闻报道和舆情信息，包括新闻标题、发布时间和情感倾向时使用。适用于企业声誉监控、品牌形象分析、危机公关预警、媒体关注度评估、企业重大事项跟踪场景。数据更新频率：T+0。 | `qcc operation get_news_sentiment --searchKey "企业名称"` |
| 进出口信用 | `get_import_export_credit` | 查询企业进出口信用信息，包括统一社会信用代码、所在地海关、行政区划、地址、经济区划、经营类别、统计经济区划、行业种类、跨境贸易电子商务类型、信用等级、备案日期。适用于国际贸易合作评估场景。数据更新频率：T+1。 | `qcc operation get_import_export_credit --searchKey "企业名称"` |
| 抽查检查 | `get_spot_check_info` | 查询企业抽查检查记录，包括检查实施机关、类型、日期、结果。适用于经营资质核查场景。数据更新频率：T+1（国家双随机抽查结果公示系统）。 | `qcc operation get_spot_check_info --searchKey "企业名称"` |
| 电信许可 | `get_telecom_license` | 查询企业电信业务经营许可信息，包括许可证号、业务分类、业务种类、覆盖范围、是否有效。适用于企业合规性评估场景。数据更新频率：T+1（工业和信息化部）。 | `qcc operation get_telecom_license --searchKey "企业名称"` |
| 融资信息 | `get_financing_records` | 查询企业融资信息，包括创投融资、上市融资、增发融资。适用于追踪企业成长轨迹、投融资历史分析及市场认可度评估场景。数据更新频率：实时监控公开披露与主流媒体报道。 | `qcc operation get_financing_records --searchKey "企业名称"` |
| 上榜榜单 | `get_ranking_list_info` | 查询企业上榜的各类榜单信息，包括榜单名称、榜内排名、来源、榜单类型、榜内名称、发布日期。适用于资本运作分析场景。数据更新频率：定期更新（随各榜单发布周期）。 | `qcc operation get_ranking_list_info --searchKey "企业名称"` |
| 荣誉信息 | `get_honor_info` | 查询企业获得的荣誉信息，包括名称、荣誉类型、级别、认证年份、发布日期、发布单位。适用于企业声誉评估场景。数据更新频率：定期更新。 | `qcc operation get_honor_info --searchKey "企业名称"` |
| 企业公告 | `get_company_announcement` | 查询企业发布的各类公告。适用于追踪上市企业重大动态、披露信息核查及企业信息透明度评估场景。数据更新频率：T+0（沪深港等交易所公告系统）。 | `qcc operation get_company_announcement --searchKey "企业名称"` |
| 双随机抽查 | `get_random_check` | 用于查询企业双随机抽查记录，包括计划编号、计划名称、任务编号、任务名称、抽查类型、抽查机关、完成日期，仅返回已完成的双随机抽查记录。适用于企业监管合规情况评估、市场监管记录核查、行业合规尽调等场景。 | `qcc operation get_random_check --searchKey "企业名称"` |

## 参数说明

### 招投标信息 - `get_bidding_info`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 资质证书 - `get_qualifications`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 信用评价 - `get_credit_evaluation`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 行政许可 - `get_administrative_license`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 招聘信息 - `get_recruitment_info`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 新闻舆情 - `get_news_sentiment`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 进出口信用 - `get_import_export_credit`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 抽查检查 - `get_spot_check_info`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 电信许可 - `get_telecom_license`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 融资信息 - `get_financing_records`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 上榜榜单 - `get_ranking_list_info`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 荣誉信息 - `get_honor_info`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 企业公告 - `get_company_announcement`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 双随机抽查 - `get_random_check`

- `searchKey`（必填）：企业名称或统一社会信用代码
