
import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';

const GET_ACADEMIC_PROGRAMS = gql`
  query ACADEMICPROGRAMS($class: String) {
  academicPrograms(
    class: $class
  ) {
    data {
      description
      course_details
      headline
      title
    }
  }
}
`;

const Index = () => {

  const classes = [{
    label: "Class 8",
    value: "C8"
  },{
    label: "Class 9",
    value: "C9"
  },{
    label: "Class 10",
    value: "C10"
  },{
    label: "Class 11",
    value: "C11"
  }]

    const [selectClass, setSelectClass] = useState("C8");
    const { loading, error, data } = useQuery(GET_ACADEMIC_PROGRAMS,{
    variables: { class:selectClass },
  });
    console.log(data);

    const onClassSelected = (event: any) => {
        setSelectClass(event.target.value);
    }

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <h3>hello world</h3>
       <select name='classes' value={selectClass} onChange={onClassSelected}>
       {classes.map((item)=>(
         <option key={item.value} value={item.value}>
           {item.label}
         </option>
       ))}
    </select>
    <br />
       {data?.academicPrograms?.data?.map((data: any,index: any)=>(
         <div key={index} style={{border: '1px solid black',margin:'10px',padding:'10px'}}>
          <h3>{data.title}</h3>
          <h4>{data.headline}</h4>
          <p>{data.description}</p>
        </div>
       ))}
    </div>
  );
}
export default Index;
