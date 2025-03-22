// function AlertDialogDeleteAccount({
//   employeeDelete,
//   setEmployeeDelete,
// }: {
//   employeeDelete: AccountItem | null
//   setEmployeeDelete: (value: AccountItem | null) => void
// }) {
//   const { mutateAsync } = useDeleteAccountMutation()
//   const deleteAccount = async () => {
//     if (employeeDelete) {
//       try {
//         const result = await mutateAsync(employeeDelete.id)
//         setEmployeeDelete(null)
//         toast({
//           title: (result.payload as { message: string }).message,
//         })
//       } catch (error) {
//         handleErrorApi({
//           error,
//         })
//       }
//     }
//   }
//   return (
//     <AlertDialog
//       open={Boolean(employeeDelete)}
//       onOpenChange={(value) => {
//         if (!value) {
//           setEmployeeDelete(null)
//         }
//       }}
//     >
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
//           <AlertDialogDescription>
//             Tài khoản<span className="rounded px-1 font-bold">{employeeDelete?.name}</span>
//             sẽ bị xóa vĩnh viễn
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>Hủy</AlertDialogCancel>
//           <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={deleteAccount}>
//             Xóa
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   )
// }
