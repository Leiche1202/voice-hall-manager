import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ApiProvider, useApi } from "./contexts/ApiContext";
import IdManagement from "./components/IdManagement";
import PermissionManagement from "./components/PermissionManagement";
import HallManagement from "./components/HallManagement";
import TeamManagement from "./components/TeamManagement";
import { getAccounts } from "./services/accountService";
import { getGroups } from "./services/groupService";
import { getHalls, getAccessibleHalls } from "./services/hallService";

// 登录页
const LoginPage = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const { login } = useApi(); // 使用API上下文

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await login(username, password);
      if (user) {
        navigate("/hall-admin-dashboard");
      }
    } catch (error) {
      setError("用户名或密码错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-700"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 120,
          damping: 20,
        }}
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          登录
        </h2>
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              用户名
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="mt-1"
              disabled={loading}
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              密码
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="mt-1"
              disabled={loading}
            />
          </div>
          {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
          <Button
            onClick={handleLogin}
            className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors duration-200"
            disabled={loading}
          >
            {loading ? "登录中..." : "登录"}
          </Button>
          <div className="flex justify-between mt-4 text-sm text-gray-600">
            <span className="hover:underline cursor-pointer text-purple-500">
              记住密码
            </span>
            <span className="hover:underline cursor-pointer text-purple-500">
              找回密码
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// 通用登出按钮
const LogoutButton = () => {
  const navigate = useNavigate();
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={() => navigate("/")}
      className="absolute top-4 right-6 text-sm text-purple-600 hover:underline"
    >
      退出登录
    </motion.button>
  );
};

// 包装 navigate 的组件
const HallAdminDashboardWrapper = () => {
  const navigate = useNavigate();
  return <HallAdminDashboard navigate={navigate} />;
};

// 厅管后台
const HallAdminDashboard = ({ navigate }) => {
  const { currentUser } = useApi();
  const [groups, setGroups] = React.useState([]);

  React.useEffect(() => {
    getGroups().then(setGroups);
  }, []);

  const permissions = React.useMemo(() => {
    const perms = {};
    currentUser?.groups?.forEach((name) => {
      const g = groups.find((gr) => gr.name === name);
      if (g) {
        Object.entries(g.permissions).forEach(([p, val]) => {
          if (val.view) perms[p] = true;
        });
      }
    });
    return perms;
  }, [currentUser, groups]);

  const sidebarColors = [
    'bg-purple-500 hover:bg-purple-600',
    'bg-purple-600 hover:bg-purple-700',
    'bg-purple-700 hover:bg-purple-800',
    'bg-purple-800 hover:bg-purple-900',
    'bg-purple-900 hover:bg-purple-950',
    'bg-purple-950 hover:bg-purple-950',
  ];

  const ButtonItem = ({ perm, to, colorClass = 'bg-purple-600 hover:bg-purple-700', children }) =>
    permissions[perm] ? (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={`${colorClass} text-white px-6 py-2 rounded-lg shadow-lg transition-colors duration-200 text-base`}
        onClick={() => navigate(to)}
      >
        {children}
      </motion.button>
    ) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 relative"
    >
      <LogoutButton />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        后台管理
        {currentUser && (
          <span className="text-lg font-normal ml-2 text-gray-500">
            {currentUser.username}
          </span>
        )}
      </h1>
      <div className="flex">
        <div className="w-48 flex flex-col gap-4 mr-6">
          <div className="border rounded-lg p-2 mb-4 space-y-2">
            <ButtonItem perm="档表管理" to="/schedule-management" colorClass={sidebarColors[0]}>
              档表管理
            </ButtonItem>
            <ButtonItem perm="工资管理" to="/salary-management" colorClass={sidebarColors[1]}>
              工资管理
            </ButtonItem>
          </div>
          <div className="border rounded-lg p-2 space-y-2">
            <ButtonItem perm="用户编辑" to="/id-management" colorClass={sidebarColors[2]}>
              用户编辑
            </ButtonItem>
            <ButtonItem perm="权限管理" to="/permission-management" colorClass={sidebarColors[3]}>
              权限管理
            </ButtonItem>
            <ButtonItem perm="分厅管理" to="/hall-management" colorClass={sidebarColors[4]}>
              分厅管理
            </ButtonItem>
            <ButtonItem perm="团队管理" to="/team-management" colorClass={sidebarColors[5]}>
              团队管理
            </ButtonItem>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <span>数据展示区域</span>
        </div>
      </div>
    </motion.div>
  );
};

// 主持中心
const HostDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 text-center relative"
    >
      <LogoutButton />
        <h1 className="text-4xl font-bold mb-8 text-gray-800">主持个人中心</h1>
      <div className="mt-8 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              今日档表安排
            </CardTitle>
            <CardDescription className="text-gray-600">
              显示您今天的工作安排。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded p-4 text-gray-700">
              档表加载中...
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              工资信息
            </CardTitle>
            <CardDescription className="text-gray-600">
              显示您的工资信息。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded p-4 text-gray-700">
              工资信息加载中...
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

// 档表管理

const ScheduleManagement = () => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = React.useState(() =>
    Array.from({ length: 24 }, () => ({ 备档: "", 主档: "", 陪档: "" })),
  );
  const { currentUser } = useApi();
  const [halls, setHalls] = React.useState([]);

  React.useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role === 'admin') {
      getHalls().then(setHalls);
    } else {
      getAccessibleHalls(currentUser.id).then(setHalls);
    }
  }, [currentUser]);
  const [selectedHall, setSelectedHall] = React.useState('');

  React.useEffect(() => {
    if (halls.length) {
      setSelectedHall(halls[0].name);
    }
  }, [halls]);
  const [scheduleId, setScheduleId] = React.useState(null);
  const [selecting, setSelecting] = React.useState(null);
  const [hosts, setHosts] = React.useState([]);

  React.useEffect(() => {
    getAccounts().then((acs) => {
      setHosts(acs.filter((a) => (a.groups || []).includes('主持')).map((a) => a.username));
    });
  }, []);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [saveStatus, setSaveStatus] = React.useState(""); // 添加保存状态提示
  const { getSchedule, saveSchedule } = useApi(); // 使用API上下文

  // 加载档表数据
  React.useEffect(() => {
    const loadSchedule = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const result = await getSchedule(today, selectedHall);
        if (result) {
          setScheduleId(result.id);
          setSchedule(result.details || []);
        }
      } catch (error) {
        console.error("Failed to load schedule:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedHall) {
      setScheduleId(null);
      setSchedule(
        Array.from({ length: 24 }, () => ({ 备档: "", 主档: "", 陪档: "" }))
      );
      loadSchedule();
    }
  }, [getSchedule, selectedHall]);

  // 状态提示自动消失
  React.useEffect(() => {
    if (saveStatus) {
      const timer = setTimeout(() => {
        setSaveStatus("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const formatHour = (h) => String(h).padStart(2, "0") + ":00";

  const handleCellClick = (hour, role) => {
    if (role !== "备档") return;
    getAccounts().then((acs) => {
      setHosts(acs.filter((a) => (a.groups || []).includes('主持')).map((a) => a.username));
    });
    setSelecting({ hour, role });
  };

  // 处理跨天排班逻辑
  const handleSelectHost = (name) => {
    const newSchedule = [...schedule];
    newSchedule[selecting.hour].备档 = name;

    // 更新主档和陪档，考虑跨天逻辑
    for (let i = 0; i < 24; i++) {
      if (i === 0) {
        // 0点的主档是前一天23点的备档
        newSchedule[i].主档 = newSchedule[23].备档 || "";
        // 0点的陪档是前一天22点的备档
        newSchedule[i].陪档 = newSchedule[22].备档 || "";
      } else if (i === 1) {
        // 1点的主档是0点的备档
        newSchedule[i].主档 = newSchedule[0].备档 || "";
        // 1点的陪档是前一天23点的备档
        newSchedule[i].陪档 = newSchedule[23].备档 || "";
      } else {
        // 正常情况：当前小时的主档是上一小时的备档，陪档是上上小时的备档
        newSchedule[i].主档 = newSchedule[i - 1].备档 || "";
        newSchedule[i].陪档 =
          newSchedule[i - 2 >= 0 ? i - 2 : i + 22].备档 || "";
      }
    }

    setSchedule(newSchedule);
    setSelecting(null);
  };

  const handleClear = () => {
    if (window.confirm("确认清空全部档表吗？")) {
      setSchedule(
        Array.from({ length: 24 }, () => ({ 备档: "", 主档: "", 陪档: "" })),
      );
      setSaveStatus("档表已清空，请记得保存更改");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("正在保存...");
    try {
      const today = new Date().toISOString().split("T")[0];
      const id = await saveSchedule({
        id: scheduleId,
        date: today,
        details: schedule,
        status: "published",
      }, selectedHall);
      if (id && !scheduleId) {
        setScheduleId(id);
      }
      setSaveStatus("档表已成功保存！");
    } catch (error) {
      console.error("Failed to save schedule:", error);
      setSaveStatus("保存失败，请重试！");
    } finally {
      // 确保在所有情况下都重置保存状态
      setIsSaving(false);
    }
  };

  // 将24小时分成两列，每列12小时
  const firstHalfHours = Array.from({ length: 12 }, (_, i) => i);
  const secondHalfHours = Array.from({ length: 12 }, (_, i) => i + 12);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 relative"
    >
      <LogoutButton />
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/hall-admin-dashboard")}
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors duration-200"
        >
          ← 返回厅管后台
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        档表管理
      </h1>

      {/* 保存状态提示 */}
      {saveStatus && (
        <div
          className={`mb-4 p-3 rounded-md text-center ${saveStatus.includes("失败") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
        >
          {saveStatus}
        </div>
      )}

      <div className="mb-4 text-center">
        <select
          className="border rounded px-3 py-1"
          value={selectedHall}
          onChange={(e) => setSelectedHall(e.target.value)}
        >
          {halls.map((h) => (
            <option key={h.id} value={h.name}>
              {h.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* 第一列：0-11小时 */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-center border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-purple-100">
              <tr>
                <th className="border p-3 text-gray-700">时间</th>
                <th className="border p-3 text-gray-700">备档</th>
                <th className="border p-3 text-gray-700">主档</th>
                <th className="border p-3 text-gray-700">陪档</th>
              </tr>
            </thead>
            <tbody>
              {firstHalfHours.map((hour) => (
                <tr
                  key={hour}
                  className={
                    hour === getCurrentBeijingHour()
                      ? "bg-purple-200 font-bold"
                      : ""
                  }
                >
                  <td className="border p-3 font-medium text-gray-800">
                    {formatHour(hour)}
                  </td>
                  {["备档", "主档", "陪档"].map((role) => (
                    <td
                      key={role}
                      className={cn(
                        "border p-3",
                        role === "备档"
                          ? "cursor-pointer hover:bg-purple-100 transition-colors duration-200"
                          : "",
                        schedule[hour][role]
                          ? "font-semibold text-purple-700"
                          : "text-gray-400",
                      )}
                      onClick={() => handleCellClick(hour, role)}
                    >
                      {schedule[hour][role] || (
                        <span className="text-gray-400">未指定</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 第二列：12-23小时 */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-center border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-purple-100">
              <tr>
                <th className="border p-3 text-gray-700">时间</th>
                <th className="border p-3 text-gray-700">备档</th>
                <th className="border p-3 text-gray-700">主档</th>
                <th className="border p-3 text-gray-700">陪档</th>
              </tr>
            </thead>
            <tbody>
              {secondHalfHours.map((hour) => (
                <tr
                  key={hour}
                  className={
                    hour === getCurrentBeijingHour()
                      ? "bg-purple-200 font-bold"
                      : ""
                  }
                >
                  <td className="border p-3 font-medium text-gray-800">
                    {formatHour(hour)}
                  </td>
                  {["备档", "主档", "陪档"].map((role) => (
                    <td
                      key={role}
                      className={cn(
                        "border p-3",
                        role === "备档"
                          ? "cursor-pointer hover:bg-purple-100 transition-colors duration-200"
                          : "",
                        // 高亮显示22:00和23:00的备档，提示跨天逻辑
                        hour >= 22 && role === "备档" ? "bg-blue-50 " : "",
                        schedule[hour][role]
                          ? "font-semibold text-purple-700"
                          : "text-gray-400",
                      )}
                      onClick={() => handleCellClick(hour, role)}
                    >
                      {schedule[hour][role] || (
                        <span className="text-gray-400">未指定</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4 flex-wrap">
        <Button
          onClick={handleClear}
          className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors duration-200 text-lg"
        >
          清空档表
        </Button>
        <Button
          onClick={handleSave}
          className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors duration-200 text-lg"
          disabled={isSaving}
        >
          {isSaving ? "保存中..." : "保存档表"}
        </Button>
      </div>

      <AnimatePresence>
        {selecting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <Card className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  选择主持（{selecting.role} - {formatHour(selecting.hour)})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {hosts.map((name) => (
                    <li key={name}>
                      <Button
                        onClick={() => handleSelectHost(name)}
                        className="w-full text-left px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
                      >
                        {name}
                      </Button>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setSelecting(null)}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    取消
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// 工资管理
const SalaryManagement = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 text-center relative"
    >
      <LogoutButton />
      <div className="mb-6 text-left">
        <Button
          variant="ghost"
          onClick={() => navigate("/hall-admin-dashboard")}
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors duration-200"
        >
          ← 返回厅管后台
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">工资管理</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            功能开发中
          </CardTitle>
          <CardDescription className="text-gray-600">
            敬请期待！
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">该功能正在开发中，我们将尽快推出。</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// 应用主入口
function App() {
  return (
    <ApiProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/hall-admin-dashboard"
              element={<HallAdminDashboardWrapper />}
            />
            <Route path="/host-dashboard" element={<HostDashboard />} />
            <Route
              path="/schedule-management"
              element={<ScheduleManagement />}
            />
            <Route path="/salary-management" element={<SalaryManagement />} />
            <Route path="/id-management" element={<IdManagement />} />
            <Route path="/permission-management" element={<PermissionManagement />} />
            <Route path="/hall-management" element={<HallManagement />} />
            <Route path="/team-management" element={<TeamManagement />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </ApiProvider>
  );
}

export default App;
// 获取北京时间的当前小时
const getCurrentBeijingHour = () => {
  // 创建当前UTC时间的Date对象
  const now = new Date();
  // 北京时间是UTC+8，计算时间差（毫秒）
  const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  // 如果已经是北京时区，则直接返回当前小时
  if (now.getTimezoneOffset() === -480) {
    return now.getHours();
  }
  // 否则返回计算后的北京时间小时
  return beijingTime.getUTCHours();
};
