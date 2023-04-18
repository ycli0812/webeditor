# Web Breadboard Editor

## Introduction

This is a simple demo for our web circuit editor. We made this to verify if our design works.

## Install and Run

After cloning the repository, you first need to install all the dependencies. Enter the project directory and run:

```shell
$ npm install -s
```

You may install these packages with a proxy software on or use`cnpm install -s` instead.

To start the development server, run:

```shell
$ npm start
```

Visit `localhost:3000` with browser to preview the project.

## Reusable Components Doc

### InputCell

#### Intro

InputCell is an editable text display with title. This component support multiple input type such as integer, float, hexadecimal color, etc. It also supports adding editable unit after the value.

There are three parts in the component: icon, value and unit. Icon is a slot where you can put in whatever you want. Value is in the mid. Users can click on it to edit the content. You can also change it to a drop-down list by changing parameters. Unit is on the right. This part is optional. It will not show if no units are given.

#### Parameters

| Name              | Type     | Required | Default Value | Description                                                  |
| ----------------- | -------- | -------- | ------------- | ------------------------------------------------------------ |
| `title`           | String   | No       | `''`          | Title above the input bar.                                   |
| `type`            | String   | No       | `'string'`    | Data type accepted by the input. Legal value: `string`, `number`, `integer`, `float`, `select`, `switch`, `password`. The component will automatically check the input value when losing focus. |
| `readonly`        | Boolean  | No       | `false`       | Indicate if this InputCell is readonly.                      |
| `value`           | Any      | Yes      |               | Default value of the input. Similar to `value` feature of native input in HTML. |
| `unit`            | String   | No       | `''`          | Unit of the value. This value should be included in `valueOptions`. |
| `valueOptions`    | Array    | No       | `[]`          | If `type` is `select`, the value will be a drop-down list. This parameter provides options for the drop-down list.<br />Every element of this array looks like: `{name: 'om', value: 'Ω'}`, where `name` field will be passed to `onValueChange` callback and `value` field will be displayed in the drop-down list. |
| `unitOptions`     | Array    | No       | `[]`          | Options for unit. The format is similar to `valueOptions`.   |
| `onValueChange`   | Function | No       | `(v) => {}`   | Callback function for value changes. New value will be passed as the only parameter. |
| `onUnitChange`    | Function | No       | `(v) => {}`   | Callback function for unit changes. New unit name will be passed as the only parameter. |
| `pattern`         | RegExp   | No       | `/.*/`        | A regular expression checking the validity of the input data. It will overwrite `type` parameter if given. Default value of this parameter matches arbitrary string. |
| `backgroundColor` | String   | No       | `'#EEEEEE'`   | Background color of the component.                           |
| `blurFix`         |          |          |               |                                                              |

#### Slots

| Name   | Required | Description                                 |
| ------ | -------- | ------------------------------------------- |
| `icon` | No       | Inserted to the left side of the component. |

#### Example

```jsx
<InputCell type='number' title='电阻' value={features[0].value} unit={features[0].unit}
    unitOptions={[{name:'om', value:'Ω'}, {name:'kom', value:'KΩ'}, {name:'mom', value:'MΩ'}]}
    onValueChange={(value) => {editor.setElementFeature(id, 'resistance', value);}}
    onUnitChange={(value) => {editor.setElementFeatureUnit(id, 'resistance', value);}}>
</InputCell>
```

## Contribution

### Add a element

Make sure the element model has been added in back-end. Otherwise the algorithm will not be performing correctly on the element.

Here is the steps to add a new element.

#### Rules of SVG

