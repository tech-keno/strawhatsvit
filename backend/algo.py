import pandas as pd
import os 
import json

# df1: given data from the client
# df2: input take from the website
current_dir = os.path.dirname(os.path.abspath(__file__))

# Construct absolute paths for the files
df1_path = os.path.join(current_dir, "uploads/Sample enrolment data.csv")
df2_path = os.path.join(current_dir, "uploads/otherstuff.xlsx")

# Load the data and convert to required format
def main(student_file, other_file, lecturers):
    df1 = pd.read_csv(student_file)
    # uncomment when running for real df2 = pd.read_csv(other_file)
    df2 = pd.read_excel(other_file)
    rows = algo(df1, df2, lecturers)
    to_convert = pd.DataFrame(rows)

    excel_file = "output/magic22.xlsx"
    to_convert.to_excel(excel_file, index=False)
    return rows




"""
Create JSON Representation of a class eg. {MITS101: {length : -1, Lecturer: Jake...}, MITS102: }
""" 
def make_classes(df1, df2):

    student_names = df1["Student Name"].to_list()
    classes = df2["Unit"].to_list()
    times = df2["Time"].to_list()
    student_names = df1["Student Name"].to_list()
    lecturer = df2["Lecturer"].to_list()
    classroom = df2["Classroom"].to_list()
    delivery_m = df2["Delivery Mode"].to_list()
    clas_dict = {}

    # Classes that don't have a length are just left blank
    for clas in range(len(classes)):
        c = classes[clas]
        if c not in clas_dict:
            clas_dict[c] = {}
            clas_dict[c]["students"] = set()
            clas_dict[c]["length"] = -1
            clas_dict[c]["delivery_mode"] = ""
            clas_dict[c]["classroom"] = ""
            clas_dict[c]["lecturer"] = ""
            
        for student_enrol in range(len(df1[c])):  
            if df1[c][student_enrol] == "ENRL":
                clas_dict[c]["length"] = times[clas]
                clas_dict[c]["students"].add(student_names[student_enrol])
                clas_dict[c]["delivery_mode"] = delivery_m[clas]
                clas_dict[c]["classroom"] = classroom[clas]
                clas_dict[c]["lecturer"] = lecturer[clas]
    return clas_dict

"""
Main Algorithm, performs the allocation process of students to specific time periods
"""

def algo(df1, df2, lecturers):
    
    removed_classes = set()
    timetable_dict = {}

    # Allocate a slot per hour 12 * 5 = 60, 12 hours a day, five days a week
    for i in range(0,55):
        timetable_dict[i] = (set(), set()) 

    clas_dict = make_classes(df1, df2)


    # Basic Algorithm: For each hour check if you can place a certain class inside the slot, if there are any students don't add the class to the slot
    for i in range(0, 55):
        for clas in clas_dict:   
            if clas_dict[clas]["length"] > 0 and clas not in removed_classes:
                # For classes longer than period 1 they may be able to fit in one block, but not as a contiguous piece
                # hence, they should not be added.
                can_schedule = True
                for period in range(clas_dict[clas]["length"]):
                    temp_set = clas_dict[clas]["students"] - timetable_dict[i + period][1]
                    if len(temp_set) != len(clas_dict[clas]["students"]):
                        can_schedule = False
                        break              
                if can_schedule:
                    for insert in range(clas_dict[clas]["length"]):
                        timetable_dict[i + insert][1].update(clas_dict[clas]["students"])
                        timetable_dict[i + insert][0].add(clas)
                    removed_classes.add(clas)


    lect_to_classes = {}
    teacher_avail = {}

    for unit in timetable_dict:

        if unit not in teacher_avail:
            teacher_avail[unit] = set()
        for clas in timetable_dict[unit][0]:
            for id_ in lecturers:
                if clas in lect_to_classes:
                    break
                elif clas in lecturers[id_] and id_ not in teacher_avail[unit]:
                    lect_to_classes[clas] = id_
                    for i in range(unit, unit + clas_dict[clas]["length"]):
                        if i not in teacher_avail:
                            teacher_avail[i] = {id_}
                        else:
                            teacher_avail[i].add(id_)
                    break

    rows = []
    used_classes = set()

    start_time = None

    
    
    for time_index in range(55):
        day,  hour = convert_index_to_time(time_index)
        for clas in timetable_dict[time_index][0]:
            if clas not in used_classes:
                rows.append({
                    'Day': day,
                    'Start Time': convert_num_time(hour),
                    'End Time': convert_num_time(hour + clas_dict[clas]["length"]),
                    'Unit': (clas),
                    'Classroom': clas_dict[clas]["classroom"],
                    'Lecturer': lect_to_classes[clas],
                    'Delivery Mode': clas_dict[clas]["delivery_mode"]
                })
                used_classes.add(clas)
    
    return rows



"""
Converts a specific index to a time period, 8am-8pm
"""

def convert_index_to_time(index):
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    day = days[index // 12]
    hour = 8 + (index % 12) 
    
    return day, hour

"""
Convert int to string format
"""
def convert_num_time(time):
    if time < 10:
        return f"0{time}:00"
    else:
        return f"{time}:00"