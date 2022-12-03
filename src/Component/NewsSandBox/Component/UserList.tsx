import {
  Button,
  Form,
  Input,
  Modal,
  Popover,
  Radio,
  Select,
  Switch,
  Table,
} from "antd";
import form from "antd/es/form";
import { ColumnsType } from "antd/es/table";
import UserForm from "./UserForm";
import axios from "axios";
import { createRef, useEffect, useRef, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

let RoleId2Type = new Map([
  [1, "超级管理员"],
  [2, "区域管理员"],
  [3, "区域编辑"],
]);

let RoleIds = Array.from(RoleId2Type.values());
export interface User {
  id: number;
  username: string;
  password: number;
  roleState: boolean;
  default: boolean;
  region: string;
  roleId: number;
}

export interface Region {
  id: number;
  title: string;
  value: string;
}

export interface RoleType {
  id: number;
  title: string;
  value: string;
}

class fr {
  setOpen = function setOpen(x: boolean) {
    // useless
  };
  setCurrentUser = function setOpen(x: User) {
    // useless
  };
}
// 添加用户
export default function UserList() {
  const [dataSource, setDataSource] = useState(Array<User>);
  const [regionList, setRegionList] = useState(Array<Region>);
  const [currentUser, setCurrentUser] = useState(
    new (class {
      id!: number;
    })()
  );
  const formRef = useRef(new fr()); // 连接跳出的表框
  const upfateFormRef = useRef(new fr()); // 连接跳出的表框

  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token") || "{}"
  );

  // 检查当前用户是否有权限更新目标用户
  const checkDisable = (targetUser: User, currentRoleId:number): boolean => {
    return targetUser.roleId < currentRoleId
  };
  console.log("enter user list");
  

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/users`).then((res) => {
      let accesiableUsers = res.data as Array<User>;
      if (roleId !== 1) {
        // 不是超级管理员则是区域管理，返回自己和相同区域的人
        accesiableUsers = accesiableUsers.filter(
          (item) => item.username === username || item.region === region
        );
      }
      setDataSource(accesiableUsers);
    });
  }, []);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/regions`).then((res) => {
      let accesiableRegions = res.data as Array<Region>
      if (roleId!==1){
        accesiableRegions = accesiableRegions.filter(
          (item)=>item.value ===region
        );
      }
      setRegionList(accesiableRegions);
    });
  }, []);

  const onCreate = (user: User) => {
    // post到后段，生成id 再设置datasource，方便后面的删除和更新
    axios
      .post("http://localhost:8000/users", {
        ...user,
        roleState: true,
        default: true,
      })
      .then((res) => {
        let respUser: User = res.data;
        setDataSource([...dataSource, respUser]);
      });
  };

  const onUpdate = (user: User) => {
    let cpy: any = dataSource.map((item) => {
      if (item.id === currentUser.id) {
        return {
          key: currentUser.id,
          id: currentUser.id,
          username: user.username,
          roleId: user.roleId,
          region: user.region,
          password: user.password,
          default: item.default,
          roleState: item.roleState,
        };
      }
      return item;
    });
    setDataSource(cpy);

    // post到后段，生成id 再设置datasource，方便后面的删除和更新
    axios
      .patch("http://localhost:8000/users/" + currentUser.id, {
        ...user,
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOnSwitch = (item: User) => {
    item.roleState = !item.roleState;
    setDataSource([...dataSource]);
    axios.patch(`http://127.0.0.1:8000/users/${item.id}`, {
      roleState: item.roleState,
    });
  };

  const columns: ColumnsType<User> = [
    {
      title: "区域",
      dataIndex: "region",
      key: "region",
      filters: [
        ...regionList.map((item) => ({
          text: item.title,
          value: item.value,
        })),
        {
          text: "全球",
          value: "全球",
        },
      ],
      onFilter: (value, item) => {
        if (value === "全球") {
          return item.region === "";
        }
        return item.region === value;
      },
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "roleId",
      key: "roleId",
      render: (roleId: number) => {
        return <p>{RoleId2Type.get(roleId)}</p>;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      // render:(item)=>{return <b>{item}</b>}
    },
    {
      title: "用户状态",
      dataIndex: "roleState",
      key: "roleState",
      render: (roleState: boolean, item: User) => {
        return (
          <Switch
            checked={item.roleState}
            disabled={item.default}
            onChange={() => {
              handleOnSwitch(item);
            }}
          />
        );
      },
    },
    {
      title: "操作",
      key: "ops",
      render: (user) => {
        return (
          <div>
            {/* 编辑键 */}
            <Button
              disabled={checkDisable(user,roleId)} //超级管理员
              onClick={() => {
                upfateFormRef.current.setOpen(true);
                setCurrentUser(user); //全部信息
                upfateFormRef.current.setCurrentUser(user); //可填写信息
              }}
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
            />
            {/* 删除键 */}
            {/* <Button
              onClick={() => {
                handleOnDelete(user);
              }}
              danger
              shape="circle"
              icon={<DeleteOutlined />}
            ></Button> */}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {/* 添加 */}
      <UserForm
        regionList={regionList}
        roleIds={RoleIds}
        onSubmit={onCreate}
        currentUserRoleId={roleId}
        cRef={formRef}
      />
      <Button
        type="primary"
        onClick={() => {
          formRef.current.setOpen(true);
        }}
      >
        添加用户
      </Button>
      {/* 更新用户 */}
      <UserForm
        regionList={regionList}
        roleIds={RoleIds}
        onSubmit={onUpdate}
        cRef={upfateFormRef}
        currentUserRoleId={roleId}
      />

      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 3 }}
      ></Table>
    </div>
  );
}
