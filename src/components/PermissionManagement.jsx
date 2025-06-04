import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getGroups, updateGroup, PERMISSIONS } from '@/services/groupService';

const PermissionManagement = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = React.useState([]);

  React.useEffect(() => {
    getGroups().then(setGroups);
  }, []);

  const [dirty, setDirty] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState("");

  React.useEffect(() => {
    if (saveStatus) {
      const t = setTimeout(() => setSaveStatus(""), 3000);
      return () => clearTimeout(t);
    }
  }, [saveStatus]);
  const togglePermission = (gIndex, perm, type, checked) => {
    const updated = [...groups];
    const current = updated[gIndex].permissions[perm] || {
      view: false,
      edit: false,
    };
    updated[gIndex].permissions[perm] = { ...current, [type]: checked };
    setGroups(updated);
    setDirty(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 text-center relative"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800">权限管理</h1>
      {saveStatus && (
        <div
          className={`mb-4 p-3 rounded-md text-center ${saveStatus.includes('失败') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
        >
          {saveStatus}
        </div>
      )}
      <Card className="shadow">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-center border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">分组</th>
                {PERMISSIONS.map((p, pi) => (
                  <th
                    key={p}
                    className={
                      "p-2 border " + (pi % 2 === 0 ? "bg-gray-50" : "bg-gray-100")
                    }
                    colSpan={2}
                  >
                    {p}
                  </th>
                ))}
              </tr>
              <tr className="bg-gray-50">
                <th className="p-1 border" />
                {PERMISSIONS.map((p, pi) => (
                  <React.Fragment key={p + '-sub'}>
                    <th
                      className={
                        'p-1 border ' + (pi % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100')
                      }
                    >
                      查看
                    </th>
                    <th
                      className={
                        'p-1 border ' + (pi % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100')
                      }
                    >
                      编辑
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((g, idx) => (
                <tr key={g.name} className="border-t">
                  <td className="p-2 border">{g.name}</td>
                  {PERMISSIONS.map((p, pi) => {
                    const perms = g.permissions[p] || { view: false, edit: false };
                    const bg = pi % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100';
                    return (
                      <React.Fragment key={g.name + p}>
                        <td className={`p-2 border ${bg}`}>
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={perms.view}
                            onChange={(e) =>
                              togglePermission(idx, p, 'view', e.target.checked)
                            }
                          />
                        </td>
                        <td className={`p-2 border ${bg}`}>
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={perms.edit}
                            onChange={(e) =>
                              togglePermission(idx, p, 'edit', e.target.checked)
                            }
                          />
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-center gap-4">
        <Button
          onClick={async () => {
            setSaveStatus('正在保存...');
            try {
              for (const g of groups) {
                await updateGroup(g.id, g);
              }
              setDirty(false);
              setSaveStatus('保存成功');
            } catch (e) {
              console.error(e);
              setSaveStatus('保存失败');
            }
          }}
          disabled={!dirty}
        >
          保存修改
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          返回
        </Button>
      </div>
    </motion.div>
  );
};

export default PermissionManagement;
