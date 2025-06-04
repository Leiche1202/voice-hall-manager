import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getGroups, saveGroups, PERMISSIONS } from '@/services/groupService';

const PermissionManagement = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = React.useState(() => getGroups());

  const togglePermission = (gIndex, perm, type, checked) => {
    const updated = [...groups];
    const current = updated[gIndex].permissions[perm] || {
      view: false,
      edit: false,
    };
    updated[gIndex].permissions[perm] = { ...current, [type]: checked };
    setGroups(updated);
    saveGroups(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 text-center relative"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800">权限管理</h1>
      <Card className="shadow">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-center border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">分组</th>
                {PERMISSIONS.map((p) => (
                  <th key={p} className="p-2 border" colSpan={2}>
                    {p}
                  </th>
                ))}
              </tr>
              <tr className="bg-gray-50">
                <th className="p-1 border" />
                {PERMISSIONS.map((p) => (
                  <React.Fragment key={p + '-sub'}>
                    <th className="p-1 border">查看</th>
                    <th className="p-1 border">编辑</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((g, idx) => (
                <tr key={g.name} className="border-t">
                  <td className="p-2 border">{g.name}</td>
                  {PERMISSIONS.map((p) => {
                    const perms = g.permissions[p] || { view: false, edit: false };
                    return (
                      <React.Fragment key={g.name + p}>
                        <td className="p-2 border">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={perms.view}
                            onChange={(e) =>
                              togglePermission(idx, p, 'view', e.target.checked)
                            }
                          />
                        </td>
                        <td className="p-2 border">
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
      <div className="mt-6 flex justify-center">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          返回
        </Button>
      </div>
    </motion.div>
  );
};

export default PermissionManagement;
