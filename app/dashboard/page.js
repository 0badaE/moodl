import Main from "@/components/Main";
import Dashboard from "@/components/Dashboard";

export const metadata = {
    title:"Moodl • Dashboard"
};

export default function DashboardPage(){

    return(
    <Main className="">
        <Dashboard/>
    </Main>
    )
}