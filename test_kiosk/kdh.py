import math
from tkinter import *

# 입력값으로 3차원 두 좌표를 정의합니다.
source_position = [0, 0, 0]
target_position = [100, 0, 0]

# 포탄의 속도를 정의합니다.
speed = 1000

# 발사 고각과 방위각을 계산합니다.
def calculate_firing_angles(source_position, target_position, speed):
    # 포탄의 발사 지점과 표적 사이의 거리를 계산합니다.
    distance = math.sqrt((target_position[0] - source_position[0])**2 + (target_position[1] - source_position[1])**2 + (target_position[2] - source_position[2])**2)

    # 발사 고각을 계산합니다.
    elevation = math.asin(target_position[2] / distance)

    # 발사 방위각을 계산합니다.
    bearing = math.atan2(target_position[1] - source_position[1], target_position[0] - source_position[0])

    return elevation, bearing, distance

# 발사 타이밍을 계산합니다.
def calculate_firing_timing(source_position, target_position, elevation, speed, distance):
    # 포탄이 표적에 도달하는 시간을 계산합니다.
    time = distance / speed

    # 발사 타이밍을 계산합니다.
    firing_timing = time / math.cos(elevation)

    return firing_timing

# 발사 고각, 방위각, 발사 타이밍을 출력합니다.
elevation, bearing, distance = calculate_firing_angles(source_position, target_position, speed)
firing_timing = calculate_firing_timing(source_position, target_position, elevation, speed, distance)

# GUI 창을 생성합니다.
window = Tk()
window.title("Firing Calculator")
window.geometry('400x200')

# 결과를 표시할 라벨들을 생성합니다.
Label(window, text=f"발사 고각: {elevation}").pack()
Label(window, text=f"발사 방위각: {bearing}").pack()
Label(window, text=f"발사 타이밍: {firing_timing}").pack()

# GUI 창을 실행합니다.
window.mainloop()