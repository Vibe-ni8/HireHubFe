export default function UserManagement() {
  return (
    <>
      <h1>User Management</h1>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Rahul Sharma</td>
              <td>rahul@test.com</td>
              <td>HR</td>
              <td>Active</td>
              <td>
                <button className="btn btn-edit">Edit</button>{" "}
                <button className="btn btn-disable">Disable</button>
              </td>
            </tr>

            <tr>
              <td>Anita Verma</td>
              <td>anita@test.com</td>
              <td>Mentor</td>
              <td>Inactive</td>
              <td>
                <button className="btn btn-edit">Edit</button>{" "}
                <button className="btn btn-enable">Enable</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
