# Formily 简介

> [官方网站](http://formilyjs.org/)
>
> [直播介绍](https://www.bilibili.com/video/BV1Cg4y1873P)

目前我们逐渐有很多需要动态配置表单的需求。比如已经有的合同模版表单、门店扩展属性模版表单，未来可能会有的工单表单等。

该类型需求的特点是：提供给运营或产品自由配置表单字段、组件、选项等的功能。所以，我们需要有一个通用的配置，来支持不同的表单需求。

在开发前，在调研了一些开源项目后，最终考虑在[react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form)和[formily](https://github.com/alibaba/formily)之间选择。

`react-jsonschema-form`主要是基于标准`JSON Schema`实现的 React 表单的库。这个库主要的功能是提供 JSON 配置到接入已有的表单组件及验证等功能的一层封装，如他们官方支持的是标准 JSON Schema 到 Material UI 和 Bootstrap 两个组件库。

`formily`同样基于标准`JSON Schema`，并加上了如 `x-component`、`x-component-props`等个性化配置，实现 JSON 配置接入各个表单组件的功能，官方支持的是 antd，next 等阿里前端组件库。

在此之外，还支持了常见的业务场景，如提供表单外部控制表单内部值的方法，修改表单内部值并联动外部方法。

考虑到对 antd 支持的比较好，以及 formily 更贴合实际业务，所以最终我们选用了 formily。

## 在业务中的使用场景

我们期望将`formily`用于动态模版表单的业务场景，在常规的后台表单需求中，依然使用 antd 的 Form 组件。

未来的动态模版表单需求整体流程应当是：

1. 提供使用拖拽、输入配置属性等交互方式的组件来配置表单 Schema
2. 经过统一输入源生成同一规范的 JSON Schema 之后，将其保存到对应的业务模块的数据库
3. 在该业务模块，需要使用表单模版的地方，由后端提供之前设置好的模版配置，前端直接使用配置即可生成表单

## 目前做了哪些事情

在基于`@formily`的基础上，我们创建了@dian/formily 仓库。现在有下面几个包：

- @dian/formily-antd

  formily 官方已经支持 antd，但仅支持了 antd 标准的组件。如果我们业务中有一些常用的表单组件，我们默认在这个包里提供了初始化方法，这样就不用在每个项目中都重复写一遍。

  其他还有如中英文设置，同样在初始化方法默认设置了使用中文。

- @dian/formily-am

  抄了 @formily/antd 这个包，用以支持 antd-mobile。

- @dian/formily-am-components

  抄了 @formily/antd-components 这个包，用以支持 antd-mobile 的组件。

- @dian/formily-utils

  业务中常用的公共方法。

- @dian/formily-editor

  表单配置编辑器。

## 常见问题

### useForm

在正常使用的情况下，

```js
<SchemaForm
  initialValues={initialValues}
  editable={false}
  schema={parsedSchema}
/>
```

引入 `useForm`之后，该操作会代理整个表单创建过程，对 SchemaForm 的配置需要放到 useForm 里。

```js
const form = useForm({
  initialValues,
  editable: ,
  effects($, { setFieldState }) {
    onFormInit$().subscribe(() => {
      setFieldState('name', (state) => {
        state.value = 123;
        state.props.disabled = false
      });
    });
  },
});

<SchemaForm form={form} />
```

### 组件改动过，跟 antd 原生组件参数不一定一致
