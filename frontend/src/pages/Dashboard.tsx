import ActivityForm from "@/components/ActivityForm"
import Navbar from "@/components/NavBar"

function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 pt-12 mt-6">
        <ActivityForm></ActivityForm>
      </div>
    </>
  )
}

export default Dashboard