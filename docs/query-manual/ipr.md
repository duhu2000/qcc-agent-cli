# ipr - 知识产权

> 知识产权布局分析，拆解品牌技术实力，为市场决策提供专业支持。

当前服务共收录 **7** 个工具，适合用于 商标、专利、软著、作品著作权与网络服务备案分析。

## 调用方式

```bash
qcc ipr <tool> --<paramKey> "<paramValue>"
```

通用参数：
- `--json`：输出原始 JSON。
- `qcc list-tools ipr`：查看该服务最新工具定义。

## 工具清单

| 中文名 | 工具名称 | 说明 | 示例 |
| :--- | :--- | :--- | :--- |
| 商标 | `get_trademark_info` | 查询企业商标注册信息。适用于企业品牌资产评估、知识产权布局分析及商标侵权风险核查场景。数据更新频率：每周更新（国家知识产权局商标局）。 | `qcc ipr get_trademark_info --searchKey "企业名称"` |
| 专利 | `get_patent_info` | 查询企业专利信息。适用于企业技术创新能力评估、核心技术储备分析及行业技术壁垒研究场景。数据更新频率：每周更新（国家知识产权局公开数据）。 | `qcc ipr get_patent_info --searchKey "企业名称"` |
| 作品著作权 | `get_copyright_work_info` | 查询企业作品著作权信息。适用于文创资产价值评估、版权保护现状分析及内容产业背调场景。数据更新频率：T+0（国家版权局）。 | `qcc ipr get_copyright_work_info --searchKey "企业名称"` |
| 软件著作权 | `get_software_copyright_info` | 查询企业的软件著作权信息，包括软件名称、软件简称、登记号、版本号、登记日期、权利取得方式。适用于知识产权保护场景。数据更新频率：T+1（国家版权局软件著作权登记系统）。 | `qcc ipr get_software_copyright_info --searchKey "企业名称"` |
| 网络服务备案 | `get_internet_service_info` | 查询企业的网站ICP备案、APP备案、小程序备案、算法备案信息，包括名称、备案号、许可证号、审核日期。适用于软件资产分析、网络服务分析场景。数据更新频率：T+1（工信部ICP/IP地址/域名信息备案管理系统）。 | `qcc ipr get_internet_service_info --searchKey "企业名称"` |
| 标准信息 | `get_standard_info` | 查询企业参与制定的各类标准。适用于评估企业行业影响力、技术领先地位及标准化合规核查场景。数据更新频率：定期更新（国家标准全文公开系统）。 | `qcc ipr get_standard_info --searchKey "企业名称"` |
| 知产出质 | `get_ipr_pledge` | 用于查询企业知识产权出质记录，包括出质知产类型、名称、商标/专利类型、出质公告日、出质期限，仅返回已注销或已解除的知产出质记录，不含当前仍有效的出质登记。适用于企业知产融资分析、无形资产负担核查、科创企业尽职调查等场景。 | `qcc ipr get_ipr_pledge --searchKey "企业名称"` |

## 参数说明

### 商标 - `get_trademark_info`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 专利 - `get_patent_info`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 作品著作权 - `get_copyright_work_info`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 软件著作权 - `get_software_copyright_info`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 网络服务备案 - `get_internet_service_info`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 标准信息 - `get_standard_info`

- `searchKey`（必填）：企业名称或统一社会信用代码


### 知产出质 - `get_ipr_pledge`

- `searchKey`（必填）：企业名称或统一社会信用代码
